document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const arrayBuffer = event.target.result;
        mammoth.convertToHtml({arrayBuffer: arrayBuffer})
            .then(displayResult)
            .catch(handleError);
    };
    reader.readAsArrayBuffer(file);
});

function displayResult(result) {
    document.getElementById('htmlOutput').innerHTML = result.value;

    // Generate navigation links
    const navigation = document.getElementById('navigation');
    navigation.innerHTML = ""; // Clear previous links

    // Updated code to extract headings using regex
    const headings = result.value.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi); 

    if (!headings || headings.length === 0) {
        const noHeadingsMessage = document.createElement('li');
        noHeadingsMessage.textContent = "No headings found in the document.";
        navigation.appendChild(noHeadingsMessage);
    } else {
        headings.forEach((heading, index) => {
            // Extract text from heading HTML
            const headingText = heading.replace(/<[^>]+>/g, ''); 

            // Create anchor elements with generic href
            const headingId = `heading${index + 1}`;
            const anchorTag = `<a id="${headingId}" href="#${headingId}"></a>`; // Anchor tag

            // Insert anchor before the heading in the HTML output
            result.value = result.value.replace(heading, `${anchorTag}${heading}`);

            // Create navigation link
            const link = document.createElement('a');
            link.textContent = headingText;
            link.href = `#${headingId}`;  
            link.onclick = scrollToAnchor;
            navigation.appendChild(link);
        });
    }
}

function scrollToAnchor(event) {
    event.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        // Calculate the offset to consider the fixed header
        const offset = targetElement.offsetTop - document.getElementById('content').offsetTop;
        window.scrollTo({ top: offset, behavior: 'smooth' });
    }
}

function handleError(err) {
    console.error(err);
    document.getElementById('htmlOutput').innerHTML = "Error occurred while converting the document.";
}
headings.forEach((heading, index) => {
    // Extract text from heading HTML
    const headingText = heading.replace(/<[^>]+>/g, ''); 

    // Create anchor elements with generic href
    const headingId = `heading${index + 1}`;
    const anchorTag = `<a id="${headingId}" href="#${headingId}"></a>`; // Anchor tag

    // Insert anchor before the heading in the HTML output
    result.value = result.value.replace(heading, `${anchorTag}${heading}`);

    // Create navigation link
    const link = document.createElement('a');
    link.textContent = headingText;
    link.href = `#${headingId}`;  
    link.onclick = scrollToAnchor;
    navigation.appendChild(link);
});

