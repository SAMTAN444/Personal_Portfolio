"""Tiny in-memory per-key sliding-window rate limiter.

No Redis, no extra deps — fine for a single-instance backend. Each key keeps a
deque of recent hit timestamps; a key is allowed if it has fewer than `limit`
hits within `window_s`. Thread-safe (the /chat handler runs in a threadpool).

Note: state is per-process. If you ever run multiple workers, each holds its own
window, so effective limits multiply by the worker count.
"""

from __future__ import annotations

import threading
import time
from collections import defaultdict, deque


class SlidingWindowLimiter:
    def __init__(self) -> None:
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()

    def hit(self, key: str, limit: int, window_s: float) -> tuple[bool, float]:
        """Record an attempt. Returns (allowed, retry_after_seconds)."""
        now = time.monotonic()
        cutoff = now - window_s
        with self._lock:
            dq = self._hits[key]
            while dq and dq[0] < cutoff:
                dq.popleft()
            if len(dq) >= limit:
                retry_after = window_s - (now - dq[0])
                return False, max(0.0, retry_after)
            dq.append(now)
            return True, 0.0


limiter = SlidingWindowLimiter()
