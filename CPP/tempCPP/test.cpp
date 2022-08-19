#include <iostream>
#include <fstream>
using namespace std;

class Hospital
{
public:
    char name[20];
    int numberMask;
    int numberGown;
    void functionOne();
};
void Hospital::functionOne()
{
    cout << name << "   ";
    if (numberGown == numberMask)
    {
        cout << "no items needed" << endl;
    }
    if (numberMask > numberGown)
    {
        cout << numberMask - numberGown << " gowns" << endl;
    }
    if (numberMask < numberGown)
    {
        cout << numberGown - numberMask << " masks" << endl;
    }
}

int main()
{
    int i;
    void input();
    cout << "Items to be supplied to each hospital:" << endl;
    input();
    return 0;
}

void input()
{
    int i, j = 0, k = 0;
    char save[50], temp[5];
    Hospital hospital[20];
    ifstream srcFile("equipment.txt", ios::in);
    if (!srcFile)
    {
        cout << "error opening source file." << endl;
        return;
    }
    while (!srcFile.eof())
    {
        srcFile.getline(save, 50);
        for (i = 0; save[i] != ';'; i++)
        {
            hospital[j].name[i] = save[i];
        }
        hospital[j].name[i] = '\0';
        i++;
        for (; save[i] != ';'; i++)
        {
            temp[k] = save[i];
            k++;
        }
        hospital[j].numberMask = atoi(temp);
        i++;
        for (k = 0; k < 5; k++)
        {
            temp[k] = '\000';
        }
        k = 0;
        for (; save[i] != ';' && save[i] != '\000'; i++)
        {
            temp[k] = save[i];
            k++;
        }
        hospital[j].numberGown = atoi(temp);
        for (k = 0; k < 5; k++)
        {
            temp[k] = '\000';
        }
        k = 0;
        hospital[j].functionOne();
        j++;
    }
}