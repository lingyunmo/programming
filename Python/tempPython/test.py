m, n = int(input()), int(input())
l, r = 0, 1
while r**m <= n:
    l = r
    r = r * 2
while l < r:
    mid = (l + r) // 2
    if mid**m <= n:
        l = mid + 1
    else:
        r = mid
print(l - 1)
