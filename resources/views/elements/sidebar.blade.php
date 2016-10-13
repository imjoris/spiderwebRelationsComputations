<div class="gw-sidebar">
    <div id="gw-sidebar" class="gw-sidebar">
        <div class="nano-content" style="vertical-align: ">

            <ul class="gw-nav gw-nav-list">
                <!-- <li class="init-un-active"> -->
                <!--     <a href="javascript:void(0)"> <span class="gw-menu-text">Navigation Menu</span> </a> -->
                <!-- </li> -->


                <!-- ############################################# -->
                <!-- Category 1 -->
                <!-- ############################################# -->
                <li class="init-arrow-down">
                    <a href="javascript:void(0)"> <span class="gw-menu-text">Options</span> <b class="gw-arrow"></b> </a>
                    <ul class="gw-submenu optionsmenu" style="float: top; padding-left: 5px; padding-right: 5px; padding-top: 20px; padding-bottom:20px;">
                        <!-- <li style="height: 230px; float: top;"> -->
                        <li>
                            <label class="custom-control custom-checkbox">
                                <input id="fixOnDragBox" type="checkbox" class="custom-control-input">
                                <span class="custom-control-indicator"></span>
                                <span class="custom-control-description">Fix position on drag</span>
                            </label>
                        </li>

                        <li>
                            <label class="custom-control custom-checkbox">
                                <input id="hideLabelsBox" type="checkbox" class="custom-control-input" onclick='myGraph.hideLabels();'>
                                <span class="custom-control-indicator"></span>
                                <span class="custom-control-description">Hide labels</span>
                            </label>
                            <!-- <a href="javascript:void(0)">Menu 1</a> -->
                        </li>


                        <li>
                            <label class="custom-control custom-checkbox">
                                <input id="keepTheForceBox" type="checkbox" class="custom-control-input" >
                                <span class="custom-control-indicator"></span>
                                <span class="custom-control-description">Don't pause when editing</span>
                            </label>
                            <!-- <a href="javascript:void(0)">Menu 1</a> -->
                        </li>

                        <hr>

                        Force link distance:
                        <div id="forceDistSliderDiv">
                            <input
                             id="forceDistSliderInput"
                             data-provide="slider"
                             data-slider-min="0"
                             data-slider-max="250"
                             data-slider-step="5"
                             data-slider-tooltip="show"
                             >
                        </div>

            <!-- data-slider-ticks="[1, 2, 3]" -->
            <!-- data-slider-ticks-labels='["short", "medium", "long"]' -->
                    </ul>
                </li>



                <!-- ############################################# -->
                <!-- Category 2 -->
                <!-- ############################################# -->
                <li class="init-arrow-down">
                    <a href="javascript:void(0)"> <span class="gw-menu-text">Category 2</span> <b class="gw-arrow icon-arrow-up8"></b> </a>
                    <ul class="gw-submenu">
                        <li>
                            <div class="ui action input">
                                <input type="text" placeholder="Search...">
                                <button class="ui button">Search</button>
                            </div>
                            <div class="ui action input">
                                <input type="text" placeholder="Search...">
                                <button class="ui button">Search</button>
                            </div>
                        </li>
                    </ul>
                </li>


                <!-- ############################################# -->
                <!-- Category 3 -->
                <!-- ############################################# -->
                <li class="init-arrow-down">
                    <a href="javascript:void(0)"> <span class="gw-menu-text">Category 3</span> <b></b> </a>
                    <ul class="gw-submenu">
                        <li> <a href="javascript:void(0)">Menu 1</a> </li>
                        <li> <a href="javascript:void(0)">Menu 2</a> </li>
                        <li> <a href="javascript:void(0)">Menu 3</a> </li>
                    </ul>
                </li>
            </ul>

        </div>
    </div>
</div>
