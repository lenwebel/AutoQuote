//alert("process FIle.");

var fileData;



$(function(){

var validators = [
    "\\b[0-9]*$\\b" // numeric only.
    ];

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
                ProcessFileData();
            }
        });
    };


    Array.prototype.toDiv = writeToDiv;

    function ProcessFileData(){
        var div = fileData.data.toDiv();

        var out = document.getElementById('out');
        out.innerHTML= "";
        out.appendChild(div);

        doValidation(fileData.data,validators);

    }

    function writeToDiv(){

        var item = this;
        var div = document.createElement('div')
                  div.setAttribute("class","table");

        var rowCounter = 0;

        item.forEach(row => {

            let rowDiv = createRowDiv(rowCounter)
            let fieldCounter = 0;
        
            // add index
            rowDiv.appendChild(createFieldDiv(rowCounter,"rownumber",rowCounter));

            row.forEach(field=>{
                let fieldDiv = createFieldDiv(field,fieldCounter,rowCounter);
                rowDiv.appendChild(fieldDiv);
                fieldCounter++;
        })

            div.appendChild(rowDiv);
            rowCounter++;
        });

        return div;

    }

    fileInput.addEventListener('change', readFile);

    function doValidation(data,validators){

            validators.forEach((validator,vindex)=>{
                data.forEach((row,rindex) => {
                    if(validate(row[vindex],validators[vindex]) ===false){
                        document.getElementById(rindex+"_"+vindex).classList.toggle("validation_error")
                    }else{
                        document.getElementById(rindex+"_"+vindex).classList.toggle("validation_success")
                    }
                });
        });
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
         var regex = new RegExp(regex);
         return regex.test(value);
    }


});