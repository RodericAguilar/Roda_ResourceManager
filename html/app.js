window.addEventListener('load', function() {
    console.log('Roda ResourceManager Started')
    LoadModule('lua')
})

var resourceName = null
var editor = null
var FileToEdit = null
var syntax = null
window.addEventListener('message', function(event) {
    var v = event.data

    switch(v.action) {
        case 'loadResources':
            $('.Contenedor').show(500)
            $('.DiscordName h1').text(v.userName)
            let status
            if (v.restatus == 'stopped') {
                status = `color: #2a2929; text-decoration: line-through`
            } else if (v.restatus == 'started') {
                status = `color: rgb(255, 255, 255)`
            }
            $('.AppendForResources').append(`
                <div class="Resource">
                    <h1 class="CenterText" id="${v.resource}-color" style="${status}">${v.resource}</h1>
                    <div class="Botones">
                        <input type="button" id="start-${v.resource}" value="Start">
                        <input type="button" id="restart-${v.resource}" value="Restart">
                        <input type="button" id="stop-${v.resource}" value="Stop">
                        <input type="button" value="Edit" class="${v.resource}-click">
                    </div>
                </div>
            `)
                $(`.${v.resource}-click`).click(function() {
                    resourceName = v.resource
                    $('.Contenedor').css({'filter': 'blur(5px)'})
                    $.post('https://Roda_ResourceManager/edit', JSON.stringify({resource: v.resource}));
                })

                $(`#start-${v.resource}`).click(function() {
                    $(`#${v.resource}-color`).css({'color': 'rgb(255, 255, 255)', 'text-decoration': 'none'})
                    $.post('https://Roda_ResourceManager/accion', JSON.stringify({resource: v.resource, accion: 'start'}));
                })

                $(`#restart-${v.resource}`).click(function() {
                    $(`#${v.resource}-color`).css({'color': 'rgb(255, 255, 255)', 'text-decoration': 'none'})
                    $.post('https://Roda_ResourceManager/accion', JSON.stringify({resource: v.resource, accion: 'restart'}));
                })

                $(`#stop-${v.resource}`).click(function() {
                    $(`#${v.resource}-color`).css({'color': '#2a2929', 'text-decoration': 'line-through'})
                    $.post('https://Roda_ResourceManager/accion', JSON.stringify({resource: v.resource, accion: 'stop'}));
                })
        break;

        case 'LoadFiles':
            $('.MenuResources').show(500)
            $('#putaInvisible').text(resourceName)
            $('.AppendResourcesRoute').append(`
                <div class="Ruta">
                    <h1 class="${v.justAppend}-clickPuta" id="${v.resource}">${v.resource.slice(1)}</h1>
                </div>
            `)

            $(`.${v.justAppend}-clickPuta`).click(function() {    
                let id = $(this).attr('id')
                FileToEdit = id
                $.post('https://Roda_ResourceManager/getData', JSON.stringify({resource: resourceName, ruta: id}));
            })
            
        break;

        case 'LoadData':
           
            if (FileToEdit.includes('.lua') == true) {
                editor.setOption("mode", 'lua')
                syntax = 'lua'
            } else if (FileToEdit.includes('.js') == true) {
                editor.setOption("mode", 'javascript')
                syntax = 'js'
            } else if (FileToEdit.includes('.css') == true) {
                editor.setOption("mode", 'css')
                syntax = 'css'
            } else if (FileToEdit.includes('.html') == true) {
                editor.setOption("mode", 'htmlmixed')
                syntax = 'html'
            }

            if (v.backup == false) {
                    /// For backup in url
                dpaste(v.data, syntax, resourceName).then(paste_url => {
                    $.post('https://Roda_ResourceManager/SendBackupUrl', JSON.stringify({url : paste_url}));
                });
                ///
            }

            editor.setValue(v.data)
            $('.EditorCont').show()
        break;

    }
})

async function dpaste(content, syntax, title) {
    var response = await fetch("https://dpaste.com/api/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `content=${encodeURIComponent(content)}&syntax=${syntax}&title=${title}&expiry=365`
    });
    return response.text();
}



function CloseAll() {
    $('.MenuResources').hide(500)
    $('.Contenedor').hide(500)
    $('#putaInvisible').text('')	
    $('.Resource').remove()
    $('.Ruta').remove()
    editor.setValue('')
    $('.EditorCont').hide()
    $('.Contenedor').css({'filter': 'blur(0px)'})
    $.post('https://Roda_ResourceManager/exit', JSON.stringify({}));
}

$(document).keyup((e) => {
    
    if (e.key === "Escape") {
            CloseAll()
    }
});

function CloseList() {
    $('#putaInvisible').text('')	
    $('.Ruta').remove()
    $('.MenuResources').hide(500)
    $('.Contenedor').css({'filter': 'blur(0px)'})
}

function CloseEditor(){
    CloseList()
    editor.setValue('')
    $('.EditorCont').hide()
}

$(function(){
    // Make search div
    $('#searchResources').on('keyup', function(){
        let value = $(this).val().toLowerCase()

        $('.Resource').filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        })
    })    

    $('.cancel').click(function(){
        CloseList()
    })

    $('#cancelruta').click(function(){
        CloseEditor()
    })

    $('#saveruta').click(function(){
        let data = editor.getValue()
        $.post('https://Roda_ResourceManager/save', JSON.stringify({resource: resourceName, ruta: FileToEdit, data: data}));
        CloseEditor()
    })

    $('.fa-xmark').click(function(){
        CloseAll()
    })
})


function LoadModule(value) {
    editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
        mode : value,
        theme: "ayu-dark",
        lineNumbers: true,
    });
}