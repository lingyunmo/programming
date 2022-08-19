from big_ol_pile_of_manim_imports import *

class Hello_world(Scene):

    def construct(self):
        helloworld = TextMobject("Hello, world!", color=RED)
        self.play(Write(helloworld))
        self.wait(1)