#include<stdio.h>
#include<stdlib.h>
#define M 100

int main(void)
{
    int i,j,k,matrix1[M][M],matrix2[M][M],row1,col1,row2,col2,matrix[M][M];
    /*Ϊ��Ҫ��˵���������ֵ��*/
    printf("�����һ�������������������");
    scanf("%d%d",&row1,&col1);
    printf("�����һ������\n");
    for(i=0;i<row1;i++){
        for(j=0;j<col1;j++){
            scanf("%d",&matrix1[i][j]);
        }
    }
    printf("����ڶ��������������������");
    scanf("%d%d",&row2,&col2);
    printf("����ڶ�������\n");
    for(i=0;i<row2;i++){
        for(j=0;j<col2;j++){
            scanf("%d",&matrix2[i][j]);
        }
    }
    /*��ʼ��matrix��*/
    for(i=0;i<row1;i++){
        for(j=0;j<col2;j++){
            matrix[i][j]=0;
        }
    }

    if(col1!=row2){
        fprintf(stderr,"enput error!");
        exit(EXIT_FAILURE);
    }
    printf("The result:\n");
    for(i=0;i<row1;i++){
        for(j=0;j<col2;j++){
            for(k=0;k<col1;k++){
                matrix[i][j]=matrix[i][j]+matrix1[i][k]*matrix2[k][j];
            }
        }
    }

    for(i=0;i<row1;i++){
        for(j=0;j<col2;j++){
            printf("%d ",matrix[i][j]);
        }
        printf("\n");
    }
    system("pause");
    return 0;
}