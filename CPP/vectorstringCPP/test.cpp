#include <iostream>
#include <vector>
#include <string>

using namespace std;

int main() {
    int i, j = 0, count = 0, spaceAverage, spaceLeftover;
    string stringInput;
    vector<string> stringStore;
    cout << "Enter a line of text:";
    getline(cin, stringInput);
    for (i = 0; i <= stringInput.length(); ++i) {
        if (stringInput[i] == ' ' || i == stringInput.length()) {
            stringStore.push_back(stringInput.substr(i - j, j));
            j = 0;
            continue;
        }
        ++count;
        ++j;
    }
    spaceAverage = (40 - count) / ((int) stringStore.size() - 1);
    spaceLeftover = 40 - count - (spaceAverage * ((int) stringStore.size() - 1));
    for (i = 0; i < 4; ++i) {
        for (j = 1; j < 10; ++j)
            cout << j;
        cout << 0;
    }
    cout << endl;
    int *spaceAddition = new int[(int) stringStore.size()];
    for (i = 0; i < (int) stringStore.size(); ++i) {
        spaceAddition[i] = spaceAverage;
        if (spaceLeftover-- > 0)
            ++spaceAddition[i];
        cout << stringStore[i];
        for (j = 0; j < spaceAddition[i]; ++j)
            cout << " ";
    }
    delete[] spaceAddition;
    return 0;
}