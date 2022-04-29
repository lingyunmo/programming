#include <iostream>
#include <Windows.h>
#include <algorithm>
#include <cmath>
#include <array>
#include <vector>
#include <iterator>
#include <algorithm>
using namespace std;
class TestClassA
{
public:
    int a = 10;
    mutable int b;
    void testFunction(int a, int b)
    {
        this->a = a;
        this->b = b;
        a = 1;
        cout << "a = " << this->a << endl;
        b = 1;
        cout << "b = " << this->b << endl;
    }
};

class TestClassB
{
public:
    int getIntA();
    void setIntA(int);

private:
    int intA;
};
int TestClassB::getIntA()
{
    return intA;
}
void TestClassB::setIntA(int x)
{
    intA = x;
}

class TestClassC
{
public:
    int value1, value2;
    TestClassC()
    {
        cout << ([&]
                 { return 1; }())
             << endl;
    }
    TestClassC(int value) : TestClassC()
    {
        cout << ([&]
                 { return value; }())
             << endl;
    }
};

class f_mod
{
private:
    int dv;

public:
    f_mod(int d = 1) : dv{d} {}
    bool operator()(int i) const { return i % dv == 0; }
};

class Plus
{
private:
    double y;

public:
    Plus() : y(0) {}
    Plus(double y) : y(y) {}
    double operator()(double x) { return x * y; }
};

void EntrustedConstruction()
{
    TestClassC b(2);
    cout << b.value1 << endl
         << b.value2 << endl;
}

void abssort(float *x, unsigned n)
{
    std::sort(x, x + n, [](float a, float b)
              { return std::abs(a) > std::abs(b); });
}

int main()
{
    float arrayFloatB[10] = {1.5454, 6.6522, 5.7676, 3.423, 7.7676, 6.7674, 7.324245, 4.3333, 33434.5454, 3.666};
    TestClassA testClass;
    testClass.testFunction(5, 4);
    cout << testClass.a << endl
         << testClass.b << endl;
    abssort(arrayFloatB, 10);
    auto lambdaTestA([](int i, float *x)
                     { std::cout << x[i] << std::endl; });
    for (int i = 0; i < 10; i++)
        lambdaTestA(i, arrayFloatB);
    auto sum1 = ([](int x, int y) -> int
                 { return x + y; });
    auto sum2([](int x, int y) -> int
              { return x + y; });
    int tempNumA = 1, TempNumB = 2, i = 0;
    cout << sum1(tempNumA, TempNumB) << endl
         << sum2(tempNumA, TempNumB) << endl;
    EntrustedConstruction();
    double xA = 4;
    Plus obj(6);
    f_mod f_mod_obj;
    cout << obj(xA) << endl
         << f_mod_obj(3) << endl;
    vector<double> arrayToVectorA(10);
    for (vector<double>::iterator it = arrayToVectorA.begin(); it != arrayToVectorA.end(); it++)
        *it = arrayFloatB[([&]()
                           {i++;return i-1; }())];
    sort(arrayToVectorA.begin(), arrayToVectorA.end(), [](double a, double b)
         { return std::abs(a) < std::abs(b); });
    for (auto iteratorA : arrayToVectorA)
        cout << iteratorA << endl;
    TestClassB testClassB;
    TestClassC base(4);
    int testNumX, TestNumA, pBN = 3, *pBN1 = &pBN, **pBN2 = &pBN1, ***pBN3 = &pBN2, big = 0, mm;
    testClassB.setIntA([&]()
                       {cin >> testNumX;return testNumX; }());
    auto functionQAQ = ([=, &TestNumA](int tempTestNumB) -> int
                        { return TestNumA += tempTestNumB + tempTestNumB; });
    cout << functionQAQ(20) << endl
         << testClassB.getIntA() << endl;
    char string1[] = {"nihaoya"}, *pString1 = string1;
    printf("%p\n%p\n%p\n%p\n%p\n", string1, pString1, pBN1, pBN2, pBN3);
    vector<int> vectorIntA;
    for (i = 0; i < ([&]()
                     {if(big==0){cin >>big;return big;}else{return big;} }());
         i++)
        vectorIntA.push_back([&]()
                             {cin >> mm;return mm; }());
    sort(vectorIntA.begin(), vectorIntA.end());
    reverse(vectorIntA.begin(), vectorIntA.end());
    for (auto interatorB : vectorIntA)
        cout << interatorB << endl;
    for (int j = 1; next_permutation(vectorIntA.begin(), vectorIntA.end()) || (j == 1); j++)
    {
        cout << j
             << "count "
             << " ";
        for (int i = 0; i < big; ++i)
            cout << vectorIntA.at(i) << ' ';
        cout << endl;
    }
    cout << (int)(vectorIntA.size()) << endl;
    system("pause");
    return 0;
}