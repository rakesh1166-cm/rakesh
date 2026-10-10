import time

_cache: dict[str, dict] = {}


def get_cache(key: str) -> dict | None:
    if key not in _cache:
        return None

    entry = _cache[key]
    if time.time() - entry["timestamp"] > entry["ttl"]:
        del _cache[key]
        return None

    return entry["data"]


def set_cache(key: str, data: dict, ttl: int) -> None:
    _cache[key] = {
        "data": data,
        "timestamp": time.time(),
        "ttl": ttl,
    }


def clear_cache() -> int:
    """Empty the cache and return how many entries were dropped."""
    count = len(_cache)
    _cache.clear()
    return count


def cache_stats() -> dict:
    now = time.time()
    entries = [
        {
            "key": key,
            "age_seconds": round(now - entry["timestamp"]),
            "expires_in_seconds": max(0, round(entry["ttl"] - (now - entry["timestamp"]))),
        }
        for key, entry in _cache.items()
    ]
    return {"total_entries": len(entries), "entries": entries}
