angular.module('main').controller('homeController',function($scope,$rootScope){
    $scope.input;
    $rootScope.playing = false;
    $rootScope.socket = undefined;
    $rootScope.requested = false;
    $scope.message = document.getElementsByClassName('info-message')[0];
    


    $scope.resetVariables = function(){
        $rootScope.turn = false;
        $rootScope.color = undefined;
        $rootScope.playing = false;
        $rootScope.friend = undefined;
        $rootScope.id = undefined;
        $rootScope.socket = undefined;
        $rootScope.requested = false;
    }

    

    $scope.guestSetup = function(){
        $scope.resetVariables();
        $rootScope.socket = io('https://connect-with-friends.herokuapp.com', {secure: true, rejectUnauthorized: false});
        
        //Request to play with user with specified id
        $rootScope.socket.emit('request',$scope.input);
        
        //Is called when host responds to guest
        $rootScope.socket.on('request',function(data){
            $rootScope.playing = true;
            $rootScope.requested = true;
            $rootScope.id = data[1];
            //If the data is an array, setup match
            //[hostId,guestId,hostTurn,color]
            if(data[0] != false){
                $rootScope.friend = data[0];
                if(data[2] == true)
                    $rootScope.turn = false;
                else
                    $rootScope.turn = true;

                if(data[3] == 1)
                    $rootScope.color = 'yellow';
                else
                    $rootScope.color = 'red';
                
                
                document.location.href = "../#!/game"; 
            }else if(data[0] == false){
                $scope.message.innerHTML = "It Looks Like Your Friend Is Busy :/";
            }
        });

        
    };

    $scope.startClicked = function(){
        $scope.guestSetup();
    };

    $scope.quickPlay = function(){

    };

    $scope.keyPressed = function(e){
        if(e.key == "Enter"){
            $scope.guestSetup();
        }
    }


    $rootScope.newGame = function(){
        //https://connect-with-friends.herokuapp.com
        $scope.resetVariables();
        $rootScope.socket = io('https://connect-with-friends.herokuapp.com', {secure: true, rejectUnauthorized: false});
        
        //Request id from server
        $rootScope.socket.emit('get-id',null);

        //Server sends id
        $rootScope.socket.on('get-id',function(data){
            $rootScope.id = data;
            document.location.href = "../#!/game";
        });
    }

    
});