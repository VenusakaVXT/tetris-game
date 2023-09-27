# Tetris Game
# The idea of ​​​​making Tetris Game
Inspired by the tetris game in the legendary childhood 4 button console Benrikids Game.

# Guide to the rules of the game
Press the **Play** button to start the game.

The blocks will automatically fall down after 1 second.

**On PC:**
- **Arrow Up**: press to rotate the block.
- **Arrow Left**: press to move the block to the left.
- **Arrow Right**: press to move the block to the right.
- **Arrow Down**: press to actively drag the block down.

![image](https://github.com/VenusakaVXT/tetris-game/assets/125566811/9596248c-4abb-4956-9f2d-d654b8696d1d)

**On Mobile phone:**
There will be 4 more buttons to let us touch the screen and control the block.

![image](https://github.com/VenusakaVXT/tetris-game/assets/125566811/ecf74678-5ab2-4058-ad8d-b81af9780797)

**Note:** 
- The best desktop UI experience is to disable Bookmarks in the browser or open in Microsoft Edge.
- And on the phone is iPhone 6, 7, 8 Plus.
- The block is set to 1 second automatically falling down 1 row, so let the block down faster than pressing the Arrow Down button, but if the setting is 0.5 seconds, the falling speed will be very fast, it will be more difficult to play.
- The block is only rotated within a certain range, so there will be some blocks that will not rotate when close to the edge of the chessboard on the left and right sides.

![image](https://github.com/VenusakaVXT/tetris-game/assets/125566811/61b71581-cc0a-4d6c-bfd5-039b694c0026)

# How to calculate points

Filling a row will add 10 points to **Score** and that row will be deleted to have more space to continue playing.

The highest score in each play will be stored in **High Score**.

When the block hits the top level, it will be **Game Over**.

Press **Play** to start a new game.

Click **Reload Page** to start playing the game again as it did the first time.

# Other customizations
In addition, there is a button to pause/continue the game, turn on/off the game soundtrack on the **Play** button.

# Result achieved
After completing this project, I myself have grasped the following knowledge:
- Using [**OOP**](https://github.com/VenusakaVXT/marriage-manager-console-version) methods in Javascript.
- Manipulating [**Canvas**](https://github.com/VenusakaVXT/template-library/tree/master/template_HTML_CSS_and_Javascript/template_HTML_CSS_JS_16) through Javascript.
- Understand game design concepts such as: object control, scoring or collision detection between objects, ....

# Existing bugs of the project
Because I only did this project to better understand logical thinking and algorithms, the product still has many errors and is not fully optimized.

Those bugs are:
- When we first enter the game, we have to press the Speaker button to open the game background music, but it does not automatically open when entering the game.
- When the game is muted, only the background music can be turned off, but the score and loss sounds are still on.
- This error occurs occasionally is sometimes pausing the game does not work.
- On the phone, when paused, it will stop, but pressing the control buttons will still rotate and move :(((.
- Only responsive for iphone 6, 7, 8 Plus, so other phones when opened will have broken UI.
- **In my opinion, this is the biggest bug: As in the Note I said that the block only rotates for the allowed range to not leave the chessboard, but there will be blocks that will rotate beyond the scope of the chessboard when rotated on the right edge of the chessboard causes the block to lose part of it and stop.**

I will try to fix all the errors of the game so that the game is as optimal as possible and in the future I can upgrade more such as: the longer you play, the faster the block drop rate will be, the more you eat at the same time will be doubled scores, ….
