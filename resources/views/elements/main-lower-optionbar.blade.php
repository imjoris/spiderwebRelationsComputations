<nav id="optionsArea">
    <ul id="optionsMenu">
        <li id="aboutMenu"><a href="#">About</a>
            <ul class="toolTipMenu aboutMenu">
                <li><a href="license.txt" target="_blank">MIT License &copy; 2014/15</a></li>
                <li id="credits" class="option">WebVOWL Developers:
                    <br/> Vincent Link, Steffen Lohmann, Eduard Marbach, Stefan Negru
                </li>
                <li><a href="http://vowl.visualdataweb.org/webvowl.html#releases" target="_blank">Version: beta 0.5.2<br/>
                                (release history)</a>
                </li>
                <li><a href="http://purl.org/vowl/" target="_blank">VOWL Specification &raquo;</a></li>
            </ul>
        </li>
        <li id="pauseOption"><a id="pause-button" href="#">Pause</a></li>
        <li id="resetOption"><a id="reset-button" href="#" type="reset">Reset</a></li>
        <li id="moduleOption"><a href="#">Modes</a>
            <ul class="toolTipMenu module">
                <li class="toggleOption" id="pickAndPinOption"></li>
                <li class="toggleOption" id="nodeScalingOption"></li>
                <li class="toggleOption" id="compactNotationOption"></li>
            </ul>
        </li>
        <li id="filterOption"><a href="#">Filter</a>
            <ul class="toolTipMenu filter">
                <li class="toggleOption" id="datatypeFilteringOption"></li>
                <li class="toggleOption" id="subclassFilteringOption"></li>
                <li class="toggleOption" id="disjointFilteringOption"></li>
                <li class="toggleOption" id="setOperatorFilteringOption"></li>
                <li class="slideOption" id="nodeDegreeFilteringOption"></li>
            </ul>
        </li>
        <li id="gravityOption"><a href="#">Gravity</a>
            <ul class="toolTipMenu gravity">
                <li class="slideOption" id="classSliderOption"></li>
                <li class="slideOption" id="datatypeSliderOption"></li>
            </ul>
        </li>
        <li id="export"><a href="#">Export</a>
            <ul class="toolTipMenu export">
                <li><a href="#" download id="exportSvg">Export as SVG</a></li>
                <li><a href="#" download id="exportJson">Export as JSON</a></li>
            </ul>
        </li>
        <li id="select"><a href="#">Ontology</a>
            <ul class="toolTipMenu select">
                <li><a href="#foaf" id="foaf">Friend of a Friend (FOAF) vocabulary</a></li>
                <li><a href="#muto" id="muto">Modular and Unified Tagging Ontology (MUTO)</a></li>
                <li><a href="#personasonto" id="personasonto">Personas Ontology (PersonasOnto)</a></li>
                <li><a href="#goodrelations" id="goodrelations">GoodRelations Vocabulary for E-Commerce</a></li>
                <li><a href="#sioc" id="sioc">SIOC (Semantically-Interlinked Online Communities) Core Ontology</a></li>
                <li><a href="#ontovibe" id="ontovibe">Ontology Visualization Benchmark (OntoViBe)</a></li>

                <li class="option" id="converter-option">
                    <form class="converter-form" id="iri-converter-form">
                        <label for="iri-converter-input">Custom Ontology:</label>
                        <input type="text" id="iri-converter-input" placeholder="Ontology IRI">
                        <button type="submit" id="iri-converter-button" disabled>Visualize</button>
                    </form>
                    <div class="converter-form">
                        <input class="hidden" type="file" id="file-converter-input" autocomplete="off">
                        <label class="truncate" id="file-converter-label" for="file-converter-input">Please select a file</label>
                        <button type="submit" id="file-converter-button" autocomplete="off" disabled>
                                    Upload
                                </button>
                    </div>
                </li>
            </ul>
        </li>
    </ul>
</nav>
