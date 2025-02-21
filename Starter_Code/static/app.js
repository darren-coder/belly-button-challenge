// Build the metadata panel
function buildMetadata(firstSample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
   .then((data) => {

    console.log("firstSample:", firstSample)
    // get the metadata field
    let metaData = data.metadata;  
    metaData.forEach(item => {
      item.id = item.id.toString();
    });
    console.log("metaData:", data.metadata);


    // Filter the metadata for the object with the desired sample number
    let sampleMeta = metaData.filter( meta => meta.id === firstSample)[0];
    console.log("sampleMeta:", sampleMeta);

    // Use d3 to select the panel with id of `#sample-metadata`
    const metadataPanel = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");
    
    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(sampleMeta).forEach(([key, value]) => {
      metadataPanel.append("h6").text(`${key}: ${value}`);  
    })
    console.log("metadataPanel:", metadataPanel)
  });
};

// function to build both charts
function buildCharts(firstSample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
  .then((data) => {

    // Get the samples field
    const samplesField = data.samples;
    console.log("samplesField", samplesField)

    // Filter the samples for the object with the desired sample number
    const sampleData = samplesField.filter(sampleObj =>  sampleObj.id === firstSample)[0];
    console.log("sampleData", sampleData)

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = sampleData.otu_ids;
    console.log("otu ids:", otu_ids)
    const otu_labels = sampleData.otu_labels;
    console.log("otu labels:")
    const sample_values = sampleData.sample_values;
    console.log("sample values:", sample_values)
    // Build a Bubble Chart
    const bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Viridis'
      }
    };    

    // Render the Bubble Chart
    const bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria'},
      hovermode: 'closest'
    };

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const barData = sampleData.sample_values.slice(0, 10).reverse(); // Get top 10 values and reverse for chart
    const barLabels = sampleData.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
    const barText = sampleData.otu_labels.slice(0, 10).reverse();

    const barTrace = {
      type: "bar",
      x: barData,
      y: barLabels,
      text: barText,
      orientation: 'h'
    };

    const barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Number of Bacteria' }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", [barTrace], barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
  .then((data) => {

    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropDownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((name => {
      dropDownMenu.append("option")
      .text(name)
      .property("value", name);
    }))

    // Get the first sample from the list
    const firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
    
    dropDownMenu.on("change", function() {
      const newSample = dropDownMenu.property("value");
      optionChanged(newSample);
    });
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected  
  buildCharts(newSample)
  buildMetadata(newSample)
}

// Initialize the dashboard
init();
