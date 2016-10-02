<aside id="detailsArea">
    <section id="generalDetails">
        <h1 id="title"></h1>
        <span><a id="about" href=""></a></span>
        <h5>Version: <span id="version"></span></h5>
        <h5>Author(s): <span id="authors"></span></h5>
        <h5>
            <label>Language: <select id="language" name="language" size="1"></select></label>
        </h5>
        <h3 class="accordion-trigger accordion-trigger-active">Description</h3>
        <div class="accordion-container scrollable">
            <p id="description"></p>
        </div>
        <h3 class="accordion-trigger">Metadata</h3>
        <div id="ontology-metadata" class="accordion-container"></div>
        <h3 class="accordion-trigger">Statistics</h3>
        <div class="accordion-container">
            <p class="statisticDetails">Classes: <span id="classCount"></span></p>
            <p class="statisticDetails">Object prop.: <span id="objectPropertyCount"></span></p>
            <p class="statisticDetails">Datatype prop.: <span id="datatypePropertyCount"></span></p>
            <div class="small-whitespace-separator"></div>
            <p class="statisticDetails">Individuals: <span id="individualCount"></span></p>
            <div class="small-whitespace-separator"></div>
            <p class="statisticDetails">Nodes: <span id="nodeCount"></span></p>
            <p class="statisticDetails">Edges: <span id="edgeCount"></span></p>
        </div>
        <h3 class="accordion-trigger" id="selection-details-trigger">Selection Details</h3>
        <div class="accordion-container" id="selection-details">
            <div id="classSelectionInformation" class="hidden">
                <p class="propDetails">Name: <span id="name"></span></p>
                <p class="propDetails">Type: <span id="typeNode"></span></p>
                <p class="propDetails">Equiv.: <span id="classEquivUri"></span></p>
                <p class="propDetails">Disjoint: <span id="disjointNodes"></span></p>
                <p class="propDetails">Charac.: <span id="classAttributes"></span></p>
                <p class="propDetails">Individuals: <span id="individuals"></span></p>
                <p class="propDetails">Description: <span id="nodeDescription"></span></p>
                <p class="propDetails">Comment: <span id="nodeComment"></span></p>
            </div>
            <div id="propertySelectionInformation" class="hidden">
                <p class="propDetails">Name: <span id="propname"></span></p>
                <p class="propDetails">Type: <span id="typeProp"></span></p>
                <p id="inverse" class="propDetails">Inverse: <span></span></p>
                <p class="propDetails">Domain: <span id="domain"></span></p>
                <p class="propDetails">Range: <span id="range"></span></p>
                <p class="propDetails">Subprop.: <span id="subproperties"></span></p>
                <p class="propDetails">Superprop.: <span id="superproperties"></span></p>
                <p class="propDetails">Equiv.: <span id="propEquivUri"></span></p>
                <p id="infoCardinality" class="propDetails">Cardinality: <span></span></p>
                <p id="minCardinality" class="propDetails">Min. cardinality: <span></span></p>
                <p id="maxCardinality" class="propDetails">Max. cardinality: <span></span></p>
                <p class="propDetails">Charac.: <span id="propAttributes"></span></p>
                <p class="propDetails">Description: <span id="propDescription"></span></p>
                <p class="propDetails">Comment: <span id="propComment"></span></p>
            </div>
            <div id="noSelectionInformation">
                <p><span>Select an element in the visualization.</span></p>
            </div>
        </div>
    </section>
</aside>
