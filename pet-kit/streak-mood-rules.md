# 4-tier mood by streak behavior

1) long_streak_happy
2) short_streak_ok
3) short_break_sad
4) long_break_unhappy

Suggested rule:
- long_streak_happy: streak >= 10
- short_streak_ok: streak 3..9
- short_break_sad: missed 1-2 consecutive days after having a streak
- long_break_unhappy: missed >= 3 consecutive days
