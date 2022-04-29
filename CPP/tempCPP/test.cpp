#include <iostream>
using namespace std;
int main()
{
    int n=3;
    int *a=new int[n];
    for (int i = 0; i < n; i++)
    {
        cin >> a[i];
    }
    int i = 0;
    int j = n - 1;
    while (i < j)
    {
        while (a[i] % 2 == 0 && i < j)
        {
            i++;
        }
        while (a[j] % 2 == 1 && i < j)
        {
            j--;
        }
        if (i < j)
        {
            swap(a[i], a[j]);
        }
    }
    for (int i = 0; i < n; i++)
    {
        cout << a[i] << " ";
    }
    return 0;
}