//文件是Animal.java
public class Animal {
    private String name;
    private int age;

    public Animal(String animalName, int animalAge) {
        name = animalName;
        age = animalAge;
    }

    public Animal(String name) {
        this.name = name;
    }

    public void setAge(int setAge) {
        age = setAge;
    }

    public void printAnimal() {
        System.out.println("名字:" + name);
        System.out.println("年龄:" + age);
    }
}