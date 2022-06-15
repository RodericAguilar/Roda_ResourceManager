let resourceName = null
let editor = null
let FileToEdit = null
let syntax = null

const handleLoad = () => {
    console.log('Roda ResourceManager Started')
    LoadModule('lua')
}

const handleMessage = (event) => {
    const v = event.data

    switch(v.action) {
        case 'loadResources':
            
            $('.Contenedor').show(500)
            $('.DiscordName h1').text(v.userName)

            const status = a == 'stopped' ? status = `color: #2a2929; text-decoration: line-through` : status = `color: rgb(255, 255, 255)`
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
                $.post('https://Roda_ResourceManager/accion', JSON.stringify({ resource: v.resource, accion: 'start' }));
            })

            $(`#restart-${v.resource}`).click(function() {
                $(`#${v.resource}-color`).css({'color': 'rgb(255, 255, 255)', 'text-decoration': 'none'})
                $.post('https://Roda_ResourceManager/accion', JSON.stringify({ resource: v.resource, accion: 'restart' }));
            })

            $(`#stop-${v.resource}`).click(function() {
                $(`#${v.resource}-color`).css({'color': '#2a2929', 'text-decoration': 'line-through'})
                $.post('https://Roda_ResourceManager/accion', JSON.stringify({ resource: v.resource, accion: 'stop' }));
            })

        break;

        case 'LoadFiles':

            $('.MenuResources').show(500)
            $('#invisible').text(resourceName)
            $('.AppendResourcesRoute').append(`
                <div class="Ruta">
                    <h1 class="${v.justAppend}-clickPuta" id="${v.resource}">${v.resource.slice(1)}</h1>
                </div>
            `)

            $(`.${v.justAppend}-clickPuta`).click(function() {    
                const id = $(this).attr('id')
                FileToEdit = id
                $.post('https://Roda_ResourceManager/getData', JSON.stringify({resource: resourceName, ruta: id}));
            })
            
        break;

        case 'LoadData':
           
            if (v.ruta.includes('.lua')) {
                editor.setOption("mode", 'lua')
                syntax = 'lua'
            } else if (v.ruta.includes('.js')) {
                editor.setOption("mode", 'javascript')
                syntax = 'js'
            } else if (v.ruta.includes('.css')) {
                editor.setOption("mode", 'css')
                syntax = 'css'
            } else if (v.ruta.includes('.html')) {
                editor.setOption("mode", 'htmlmixed')
                syntax = 'html'
            }

            if (!v.backup) {
                /// For backup in url
                dpaste(v.data, syntax, resourceName).then(paste_url => {
                    $.post('https://Roda_ResourceManager/SendBackupUrl', JSON.stringify({url : paste_url}));
                });
            }

            editor.setValue(v.data)
            $('.EditorCont').show()
        break;
        }
}

const dpaste = async(content, syntax, title) => {
    const response = await fetch("https://dpaste.com/api/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `content=${encodeURIComponent(content)}&syntax=${syntax}&title=${title}&expiry=365`
    });
    return response.text();
}

const LoadModule = (value) => {
    const editor = document.getElementById('editor')
    editor = CodeMirror.fromTextArea(editor, {
        mode : value,
        theme: "ayu-dark",
        lineNumbers: true,
    });
}

const CloseAll = () => {
    $('.MenuResources').hide(500)
    $('.Contenedor').hide(500)
    $('#invisible').text('')	
    $('.Resource').remove()
    $('.Ruta').remove()
    editor.setValue('')
    $('.EditorCont').hide()
    $('.Contenedor').css({'filter': 'blur(0px)'})
    $.post('https://Roda_ResourceManager/exit', JSON.stringify({}));
}

const CloseList = () => {
    $('#invisible').text('')	
    $('.Ruta').remove()
    $('.MenuResources').hide(500)
    $('.Contenedor').css({'filter': 'blur(0px)'})
}

const CloseEditor = () => {
    CloseList()
    editor.setValue('')
    $('.EditorCont').hide()
}

$(document).keyup((e) => {
    if (e.key === "Escape") {
        CloseAll()
    }
});

$(() => {
    $('#searchResources').on('keyup', () => {
        const value = $(this).val().toLowerCase()

        $('.Resource').filter(() => {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        })
    })    

    $('.cancel').click(() => {
        CloseList()
    })

    $('#cancelruta').click(() => {
        CloseEditor()
    })

    $('#saveruta').click(() => {
        let data = editor.getValue()
        $.post('https://Roda_ResourceManager/save', JSON.stringify({ resource: resourceName, ruta: FileToEdit, data: data }));
        CloseEditor()
    })

    $('.fa-xmark').click(() => {
        CloseAll()
    })
})

window.addEventListener('load', handleLoad)
window.addEventListener('message', handleMessage)