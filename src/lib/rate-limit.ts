const buckets=new Map<string,number[]>();
export function checkRateLimit(key:string,limit:number,windowMs=60000){const now=Date.now();const recent=(buckets.get(key)??[]).filter(t=>now-t<windowMs);if(recent.length>=limit)return false;recent.push(now);buckets.set(key,recent);return true;}
