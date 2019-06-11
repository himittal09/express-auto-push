import * as http from 'http';
import * as http2 from 'http2';
import { Request, Response, NextFunction } from 'express';
import { AssetCacheConfig, AutoPush, PreprocessResult } from 'h2-auto-push';

/**
 * // TODO: Tune these default parameters.
const DEFAULT_CACHE_CONFIG: AssetCacheConfig = {
  warmupDuration: 500,
  promotionRatio: 0.8,
  demotionRatio: 0.2,
  minimumRequests: 1,
};
 */

export type RawRequest = http.IncomingMessage | http2.Http2ServerRequest;
export type RawResponse = http.ServerResponse | http2.Http2ServerResponse;
export interface AutoPushOptions {
    rootDir: string;
    assetCacheConfig?: AssetCacheConfig;
}

function isHttp2Request(req: RawRequest): req is http2.Http2ServerRequest {
    return !!(req as http2.Http2ServerRequest).stream;
}

function isHttp2Response(res: RawResponse): res is http2.Http2ServerResponse {
    return !!(res as http2.Http2ServerResponse).stream;
}

const CACHE_COOKIE_KEY = '__ap_cache__';
let autoPush: AutoPush;

export default function (options: AutoPushOptions) {
    return function (req: Request, res: Response, next: NextFunction): void {

        if (options.assetCacheConfig) {
            autoPush = new AutoPush(options.rootDir, options.assetCacheConfig);    
        } else {
            autoPush = new AutoPush(options.rootDir);    
        }
        
        if(isHttp2Request(req)) {
            
            const cacheKey = req.cookies[CACHE_COOKIE_KEY];
            autoPush.preprocessRequest(options.rootDir, req.stream, cacheKey).then((result: PreprocessResult) => {
                res.cookie(CACHE_COOKIE_KEY, result.newCacheCookie);
                return result.pushFn();
            }).then(next).catch((error: Error) => next(error));

            // req.stream.on('error', (error) => {
            
            // });
        }

        if (isHttp2Response(res)) {
            console.log(res.statusCode);
            if (res.statusCode === 404 && req.url) {
                autoPush.recordRequestPath(res.stream.session, options.rootDir, false);
            } else if (req.statusCode && req.statusCode < 300 && req.statusCode >= 200 && req.url) {
                autoPush.recordRequestPath(res.stream.session, options.rootDir, true);                
            }
        }
    };
}

// use express cookieparser missleware before using this middleware
