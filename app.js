// creating an array from the "node list" returned from the
// querySelectorAll of the .choice classes
let choices = Array.from(document.querySelectorAll(".choice"));

// creating an array for finger-num class too
let finger_numbers = Array.from(document.querySelectorAll(".finger-num"));

// es2015 syntax to loop through an array and access each element as
// an argument to the function
// we are adding a click event listener to all elements with choice class
// calling function choose_player_label 
choices.forEach(choice => choice.addEventListener("click", choose_player_label));

// doing as we did for the .choice class
finger_numbers.forEach(fin_num => fin_num.addEventListener("click", choose_finger_num));

// adding click event to the button with start id to call the function start when clicked
document.getElementById("start").addEventListener("click", start);

// global variables needed

// holds the current choice of the user player
let player_label;
// holds the number of fingers the user player chose
let player_finger;
// holds the current choice of the computer player
let comp_label;
// holds the score of the human player
let user_score = 0;
// holds the current winner of the game
// when we count the baby lawyer muslim church on the 
// fingers the one who won
let winner;

// array of possible choices the computer player can choose from
let possible_choices = ['baby', 'lawyer', 'muslim', 'church'];

// function that runs when the human player chooses a choice
function choose_player_label(ev){
    // clears all chosen class from all choices
    removeChosen();
    //adding chosen class to the classlist of the element
    // that is clicked on currently
    ev.target.classList.add("chosen");
    // setting the global variable player_label to
    // the data-choice value of the currently clicked element 
    player_label = ev.target.dataset.choice;
    // checks while the comp_label is not set to anything
    // or comp_label (what the computer chose) is equal to 
    // what the player chose (player_label)
    while (!comp_label || comp_label == player_label){
        // setting comp_label to a random index in the possible choices
        comp_label = possible_choices[Math.floor(Math.random() * possible_choices.length)]
    }
    // seting the text in the player-label element to what the player chose
    // and what the computer chose
    document.getElementById("player-label").textContent = `You are the ${player_label} and I'm the ${comp_label}`;
}
// function that removes chosen class from
// from all .choice elements
function removeChosen(){
    choices.forEach(choice => choice.classList.remove("chosen"));
}

// function that chooses number of fingers based on a button clicked
// and sets the textContent of #chosen element to it
function choose_finger_num(ev){
    player_finger = ev.target.dataset.finger;
    document.getElementById("chosen").textContent = player_finger;
}

function start(){
    // checking to see if the player has chosen a "choice" and
    // a number of fingers
    if (player_label && player_finger){
        // setting #finger-show element's content to two div with round class
        document.getElementById("finger-show").innerHTML = `<div class="round"></div>`.repeat(2);
        // making an array of the two "rounds" created and 
        // putting them in a variable rounds
        let rounds = Array.from(document.querySelectorAll(".round"));
        
        let comp_choice = computer_choice()
        // setting winner to the current winner
        winner = determine_winner(player_finger, comp_choice);
        // updating points
        update_points(winner, comp_label, player_label);
        
        rounds.forEach(round => {
            // showing the round since it's initially set to display none
            round.style.display = "block";
            // starting it's animation we defined in the css
            round.style.animationPlayState = "running";
            // animation end is triggered when the animation completes
            round.addEventListener("animationend", () => {
                // getting the number of images to display for both
                // the human player and the computer
                let player_img = determine_fingers(player_finger);
                let comp_img = determine_fingers(comp_choice);
                
                // displaying results of operations we made
                
                document.getElementById("winner").textContent = `the ${winner} wins`;
                document.getElementById("finger-show").innerHTML = player_img + comp_img;
                document.getElementById("user-score").textContent = user_score;
            })
        })
    }
}

// this function determines the number of images
// to show based on the number of fingers it is
// given
function determine_fingers(num_of_fingers){
    let img;
    // checking to see if the number of fingers is five or less
    // since the that's the highest number of fingers
    // an image of a finger can show
    if (num_of_fingers <= 5){
        img = `<img src="images/finger${num_of_fingers}.png" />`;
    }
    else {
        // if the number of fingers passed is greater than five
        // which if pictured in real life means the player used
        // two hands to play

        // making an additional image to display alongside with an already
        // five-finger-image based on our design decision the only time
        // a user can use two hands is when the player is putting more
        // than 5 fingers on board
        let additional_img = num_of_fingers % 5 == 0 ? 5 : num_of_fingers % 5;
        // rendering the additional image alongside with the five
        // fingers
        img = `<img src="images/finger5.png" />
                <img src="images/finger${additional_img}.png" />`
    }
    return img;
}

// chooses a random number from 1 to 10
// based on design decision the computer can't choose
// 0 but can choose 10
function computer_choice(){
    return Math.floor((Math.random() * 10) + 1);
}

function determine_winner(player_finger, comp_choice){
    // converting number of fingers both players chose to
    // integers and adding them
    let total = parseInt(player_finger) + parseInt(comp_choice);
    // making a winner index to index into the possible choices array
    let winner_indx = (total % 4) == 0 ? 0 : (total % 4) -1;
    return possible_choices[winner_indx];
}

// adding 10 to the user player score if wins and
// decreasing by 10 if loses
function update_points(winner, computer_label, player_label){
    if (winner == player_label){
        user_score += 10;
    }
    else if (winner == computer_label){
        user_score -= 10;
    }
}