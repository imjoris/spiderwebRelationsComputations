            <!-- id -->
            <div class="bottombar" ng-app="graphApp" ng-controller="graphController">
            <!-- <div class="navbar-header"> -->
            <!--     <a class="navbar-brand" href="#">Lively Spiderweb</a> -->
            <!-- </div> -->
            <ul>
                <li ng-click="">
                    <a ng-click="playGraph()" ng-show="isPaused" href="#">Play</a>
                    <a ng-click="pauseGraph()" ng-hide="isPaused" href="#">Pause</a>
                </li>
                <li><a href="#">Page 1</a></li>
                <li><a href="#">Page 2</a></li>
                <li><a href="#">Page 3</a></li>
            </ul>

        </div>
