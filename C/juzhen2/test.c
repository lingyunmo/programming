#include <stdio.h>
#include <stdlib.h>

void main()
{
    int i,j;
    int dimension;
    double deterValue=1;
    double **array,**deterArray, **companionMatrix, *temp;
    
    //��������
    void printfDouble2Dimension(int s, int n, double **array);
    double deter(int dimension, double **array);
    void copyDouble2Dimension(int s, int n, double **source, double **dest);
    void getCompanionMatrix(int dimension, double **array, double **companionMatrix);

    printf("�����뷽��Ľ���N:");
    scanf("%d",&dimension);

    array=(double**)malloc(dimension*sizeof(double*));
    deterArray=(double**)malloc(dimension*sizeof(double*));
    companionMatrix =(double**)malloc(dimension*sizeof(double*));
    
    //ѭ�����뷽��
    for(i=0;i<dimension;i++)
    {
        temp=(double*)malloc(dimension*sizeof(double));
        deterArray[i]=(double*)malloc(dimension*sizeof(double));
        companionMatrix[i]=(double*)malloc(dimension*sizeof(double));

        printf("�����뷽��ĵ�%d��:",i+1);
        for(j=0;j<dimension;j++)
            scanf("%lf",temp+j);
        array[i]=temp;
    }
    //��������
    copyDouble2Dimension(dimension,dimension,array,deterArray);

    //��ӡ����
    printf("������ȱ任֮ǰ����:\n");
    printfDouble2Dimension(dimension,dimension,array);    
    deterValue = deter(dimension,deterArray);
    
    printf("������ȱ任֮������:\n");
    printfDouble2Dimension(dimension,dimension,deterArray);

    if(deterValue==0)
    {
        printf("��������ʽֵΪ��.\n");
        system("pause");
        return ;
    }        
    printf("����ʽ��ֵ:%.2lf\n",deterValue);
    //��������
    getCompanionMatrix(dimension,array,companionMatrix);

    //��ӡ�������
    printf("�����������:\n");
    printfDouble2Dimension(dimension, dimension, companionMatrix);
    system("pause");
}

//��������
void getCompanionMatrix(int dimension, double **array, double **companionMatrix)
{
    int i,j,k,l,m,n,o;
    int flag;//��־��������ʽ�ķ���
    double **companionTemp;
    double deter(int dimension,double **array);

    companionTemp =(double**)malloc((dimension-1)*sizeof(double*));
    for(i=0;i<dimension-1;i++)
        companionTemp[i]=(double*)malloc((dimension-1)*sizeof(double));

    for(i=0;i<dimension;i++)
    {
        for(j=0;j<dimension;j++)
        {
            flag=(i+j)%2==0?1:-1;
            for(k=0,m=0;k<dimension;k++)
            {
                if(k==i)continue;        
                for(l=0,n=0;l<dimension;l++)
                {
                    if(l==j)continue;
                    *(*(companionTemp+m)+n) = *(*(array+k)+l);
                    n++;     
                }
                m++;
            }
            //��i�У���j�еĴ�������ʽ ��ֵ����j�У���i��
            *(*(companionMatrix+j)+i) = flag * deter(dimension-1,companionTemp);
        }
    }
}

/*
 * calculate the determinant value
 */
double deter(int dimension,double **array)
{
    int i,j,k,l,b;
    int flag =1;
    double sum=1;
    double temp;
    for(i=0,j;i<dimension-1;i++)
    {
        j=i;
        if(*(*(array+i)+j)==0)
        {
            b=0;
            for(k=i+1;k<dimension;k++)
            {
                if(*(*(array+k)+j)!=0)//�ҵ�һ�в�Ϊ0��,Ȼ���� 
                {
                    for(l=j;l<dimension;l++)
                    {
                        temp=*(*(array+k)+l);
                        *(*(array+k)+l)= *(*(array+i)+l);
                        *(*(array+i)+l)=temp;
                    }
                    flag*=-1;
                    b=1;
                    break;
                }
            }
            if(!b)
            {
                return 0;
            }
            i--;
            continue;
        }
        for(;j<dimension-1;j++)
        {
            if(*(*(array+j+1)+i)==0) 
                continue;
            temp = -*(*(array+j+1)+i)/ *(*(array+i)+i);
            for(k=i;k<dimension;k++)
                *(*(array+j+1)+k)+= *(*(array+i)+k)*temp;
        }
    }
    
    for(i=0;i<dimension;i++)
        sum*= *(*(array+i)+i);
    return sum*flag;
}

//��ӡ����
void printfDouble2Dimension(int s, int n, double **array)
{
    //printf("%d,%d",s,n);
    int i,j;
    for(i=0;i<s;i++)
    {
        for(j=0;j<n;j++)
        {
            printf("%6.2lf",*(*(array+i)+j));    
        }
        printf("\n");
    }
}

//��������
void copyDouble2Dimension(int s, int n, double **source, double **dest)
{
    int i,j;
    for(i=0;i<s;i++)
    {
        for(j=0;j<n;j++)
        {
            *(*(dest+i)+j)=*(*(source+i)+j);
        }
    }
}