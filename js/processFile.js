//alert("process FIle.");

var fileData;



$(function(){

var RESULTS_PER_PAGE = 50;


//var validators = [
//    null,//"\\b[0-9]*\\b|[' ']" // numeric only.
//    null,//,"^[aA]"
//    null, //,"^[bB]"
//    ];

    var HomeTemplate = [
        'Member Number',
        'First Name',
        'Surname',
        'Email',
        'Gender',
        'Rego',
        'QuoteNumber',
        'Amount'
    ];


    init();


    function init(){

        $(".dropdown-menu  li").off('click').on('click', e => selectTemplate(e));

    }

    function selectTemplate(e){
        $('#selectedtemplate').text(e.currentTarget.textContent);
    }

    var fileInput = document.getElementById("csv");

            readFile = function () {
            var reader = new FileReader();
            
            reader.onload = function () {
                document.getElementById('out').innerHTML = reader.result;
            };
            
            // start reading the file. When it is done, calls the onload event defined above.
            var file = fileInput.files[0];
            reader.readAsBinaryString(file);
            
            Papa.parse(fileInput.files[0], {
                complete: function(results) {
                fileData = results;
                ProcessFileData(RESULTS_PER_PAGE);
            }
        });
    };


    Array.prototype.toDiv = writeToDiv;

    function ProcessFileData(resultsPerPage,from=null){
        var div = fileData.data.toDiv(resultsPerPage,from);
        var out = document.getElementById('out');
        out.innerHTML= "";
        out.appendChild(div);
        doValidation(fileData.data,validators);
        
    }

    function writeToDiv(resultsPerPage,from =null){
        
        var items = this;
        var pageNumbers ;
        if(resultsPerPage != null && resultsPerPage != undefined && (from == null || from == undefined)){
            from = 0;
           }
             to =  from + resultsPerPage;//items.length - 1 ;
    
        var div = document.createElement('div')
                  div.setAttribute("class","table");

        let NumberOfPages = Math.ceil(items.length / RESULTS_PER_PAGE,100)-1;
            console.log("Number of pages:",NumberOfPages)
          
            div.appendChild(createPageSelector(NumberOfPages,resultsPerPage)); // add pageNumbers to top;
            // create rows
        //items.forEach((row,rIndex) => {
     if(from !==0){
         let rowDiv = createRowDiv(0)
             rowDiv.appendChild(createFieldDiv(0,"rownumber",0));
                items[0].forEach((field,fIndex)=>{
                            let fieldDiv = createFieldDiv(field,fIndex,0);
                            rowDiv.appendChild(fieldDiv);
                         });
            div.appendChild(rowDiv);
     }       

     for (var rIndex = from; rIndex<=to;rIndex++)
     {
            let rowDiv = createRowDiv(rIndex)
            // add index
            rowDiv.appendChild(createFieldDiv(rIndex,"rownumber",rIndex));


            // create fields;          
            items[rIndex].forEach((field,fIndex)=>{
                            let fieldDiv = createFieldDiv(field,fIndex,rIndex);
                            rowDiv.appendChild(fieldDiv);
                         });
            div.appendChild(rowDiv);
    }
        //});

            div.appendChild(createPageSelector(NumberOfPages,resultsPerPage));

        return div;

    }

    fileInput.addEventListener('change', readFile);

    function doValidation(data,validators){

            validators.forEach((validator,vindex)=>{
                data.forEach((row,rindex) => {
                    if(rindex===0){return;}
                    var isValid = validate(row[vindex],validators[vindex]);
                    
                    if(isValid === false){
                        toggleClass(rindex+"_"+vindex,"validation_error")
                    }else{
                        toggleClass(rindex+"_"+vindex,"validation_success");
                    }
                });
        });
    }
    function toggleClass(elementName,className){
        let element  = document.getElementById(elementName)
        if(element){
            element.classList.toggle(className)
        }
    }

    function createFieldDiv(value, fieldIndex,rowIndex ){
            let fieldDiv = document.createElement('div')
                fieldDiv.setAttribute('class','field field_' + fieldIndex)
                fieldDiv.innerText = value;
                fieldDiv.setAttribute('id',rowIndex + "_" + fieldIndex);
                return fieldDiv;
    }

    function createRowDiv(rowIndex){
        let rowDiv = document.createElement('div');
        rowDiv.setAttribute('class','row row_' + rowIndex);
        return rowDiv;
    }

    function validate(value,regex){
         var re = new RegExp(regex);
         let result  =  re.test(value);
         return result;
    }
    
    function createPageSelector(numberOfPages,resultsPerPage){

        let ul = document.createElement('ul');
            ul.setAttribute('class','pagination'); // bootstrap pagination;
        
        for(var i = 1; i <= numberOfPages;i++)
        {
            let li = document.createElement('li');
            let a = document.createElement('a');
                    a.setAttribute("data-value",i)
                    a.innerText= String("0" + i).slice(-2);; 
                    a.onclick = function(e){
                        
                        let i= e.currentTarget.getAttribute("data-value");
                        ProcessFileData(resultsPerPage,((i * resultsPerPage) - resultsPerPage));
                    };
                    li.appendChild(a)
                   ul.appendChild(li);
        }
        return ul;
    }
});