#include <stdio.h>
#include <stdlib.h>
#include <math.h>
typedef struct _DET
{
    int *num;
    struct _DET *next;
} DET;
DET *create_determinant(int N)
{
    DET *h, *s, *r;
    h = (DET *)malloc(sizeof(DET));
    r = h;
    for (int i = 0; i < N; i++)
    {
        s = (DET *)malloc(sizeof(DET));
        s->num = (int *)malloc(N * sizeof(int));
        r->next = s;
        r = r->next;
    }
    r->next = NULL;
    return h->next;
}
DET *creat_remainder(DET *p, int N, int c)
{
    DET *h, *n, *r;
    N--;
    h = create_determinant(N);
    n = h;
    p = p->next;
    while (n)
    {
        for (int i = 0, k = 0; i <= N; i++)
        {
            if (i != c)
            {
                n->num[k++] = p->num[i];
            }
        }
        n = n->next;
        p = p->next;
    }
    return h;
}
int result(DET *p, int N)
{
    int res = 0, i;
    if (N == 1)
    {
        res = p->num[0];
    }
    if (N == 2)
    {
        res = p->num[0] * p->next->num[1] - p->num[1] * p->next->num[0];
    }
    else if (N > 2)
    {
        for (i = 0; i < N; i++)
        {
            res += p->num[i] * result(creat_remainder(p, N, i), N - 1) * pow(-1, i);
        }
    }
    return res;
}
int main(void)
{
    int N, res;
    DET *origin, *h, *p;
    printf("��������Ҫ��������ʽ�Ľ�����");
    scanf("%d", &N);
    h = create_determinant(N);
    p = h;
    while (p)
    {
        for (int i = 0; i < N; i++)
        {
            scanf("%d", &p->num[i]); //��ÿһ�и�ֵ
        }
        p = p->next; //ת����һ��
    }                //����h�ѳ�Ϊ����Ҫ��N������ʽ
    res = result(h, N);
    printf("���Ϊ��%d", res);
    getchar();
    getchar();
    return 0;
}