import Vue from 'vue'

Vue.prototype.$getKeyByValue = function(object, value) {
return Object.keys(object).find(key => object[key] === value);
}

Vue.prototype.$removeNullFields = function(obj){
    Object.keys(obj).forEach((key) => (obj[key] == null) && delete obj[key])
    return obj
}

// Slugify a string
Vue.prototype.$slugify = function(str)
{
    str = str.replace(/^\s+|\s+$/g, '');

    // Make the string lowercase
    str = str.toLowerCase();

    // Remove accents, swap ñ for n, etc
    var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    // Remove invalid chars
    str = str.replace(/[^a-z0-9 -]/g, '') 
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-') 
    // Collapse dashes
    .replace(/-+/g, '-'); 

    return str;
}

Vue.prototype.$sortTable = function(n,table_id) {    
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById(table_id);
    var head = table.getElementsByTagName("th")[n]
    var icon = head.getElementsByClassName("arrow")[0] 
    icon.style.visibility = "hidden"  
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];

        if ( isNaN(parseInt(x.innerHTML.replace(/,/g, ''))) ){			
			/* Check if the two rows should switch place,
			based on the direction, asc or desc: */
			if (dir == "asc") {         
				if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
					// If so, mark as a switch and break the loop:
					shouldSwitch = true;
					break;
				}
			} 
			else if (dir == "desc") {          
				if ( x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
					// If so, mark as a switch and break the loop:
					shouldSwitch = true;
					break;
				}
			}
        } 
        if ( ! isNaN(parseInt(x.innerHTML.replace(/,/g, ''))) ){
            /* Check if the two rows should switch place,
			based on the direction, asc or desc: */
			if (dir == "asc") {         
				if (parseInt(x.innerHTML.replace(/,/g, '')) > parseInt(y.innerHTML.replace(/,/g, ''))) {
					// If so, mark as a switch and break the loop:
					shouldSwitch = true;
					break;
				}
			} 
			else if (dir == "desc") {          
				if ( parseInt(x.innerHTML.replace(/,/g, '')) < parseInt(y.innerHTML.replace(/,/g, ''))) {
					// If so, mark as a switch and break the loop:
					shouldSwitch = true;
					break;
				}
			}
        }    
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }    
    if(dir === 'asc'){
        icon.classList.remove('up')
        icon.classList.add('down')
        icon.style.visibility = "visible"
    }
    else{
        icon.classList.add('up')
        icon.classList.remove('down')
        icon.style.visibility = "visible"
    }
}

Vue.prototype.$searchTable = function(table,searchKey) {    
	// Declare variables
	var cells_length, tr, td, i, j, txtValue
	searchKey = searchKey.toUpperCase()
	table = document.getElementById(table)
	tr = table.getElementsByTagName("tr")
	cells_length = table.rows[0].cells.length
  
	// Loop through all table rows, and hide those who don't match the search query
	for (i = 1; i < tr.length; i++) {
		var searchKey_exists = false
		//loop through all table columns checking if they contain search query
		for (j = 0; j < cells_length; j++) {			
			td = tr[i].getElementsByTagName("td")[j]			
			if (td) {
				txtValue = td.textContent || td.innerText				
				if (txtValue.toUpperCase().replace(/,/g, '').indexOf(searchKey) > -1) {					
					searchKey_exists = true					
					break
				} 
				else{
					continue					
				}
			}
		}
		if (searchKey_exists){			
			tr[i].style.display = ""		
		}
		else{
			tr[i].style.display = "none"
		}
	}
}


function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
}

Vue.prototype.$exportTable = function(table_name,filename) {
	var csv = [];
	var table = document.getElementById(table_name)
	var rows = table.getElementsByTagName("tr");
    
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        
		for (var j = 0; j < cols.length; j++) 			
            row.push(cols[j].innerText.replace(/,/g, ''));
        
        csv.push(row.join(","));        
    }

    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}