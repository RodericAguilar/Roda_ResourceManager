local open = false

RegisterNetEvent('Roda_ResourceManager:OpenUi')
AddEventHandler('Roda_ResourceManager:OpenUi', function (resources)
    if not open then 
        FocusBlur(true)
        for k,v in pairs(resources) do 
            SendNUIMessage({
                action = 'loadResources',
                resource = v.name,
                restatus = v.status,
                userName = GetPlayerName(PlayerId())
            })
        end
        open = true
    end
end)

RegisterNUICallback('exit', function(data, cb)
    open = false
    FocusBlur(false)
end)

RegisterNUICallback('getData', function(data, cb)
    TriggerServerEvent('Roda_ResourceManager:GetData', data.resource, data.ruta)
end)

RegisterNUICallback('edit', function(data, cb)
    TriggerServerEvent('Roda_ResourceManager:EditResource', data.resource)
end)

RegisterNetEvent('Roda_ResourceManager:OpenEdit')
AddEventHandler('Roda_ResourceManager:OpenEdit', function (resource)
    for k,v in pairs(resource) do 
        SendNUIMessage({
            action = 'LoadFiles',
            resource = v,
            justAppend =  removePointAndMore(v),
        })
    end
end)

function removePointAndMore(str)
    local first =  str:gsub('%.', '')
    local second = first:gsub('%/', '')
    return second
end


RegisterNUICallback('accion', function(data, cb)
    TriggerServerEvent('Roda_ResourceManager:Accion', data.resource, data.accion)
end)

RegisterNetEvent('Roda_ResourceManager:SendData')
AddEventHandler('Roda_ResourceManager:SendData', function (resource, ruta, data)
    SendNUIMessage({
        action = 'LoadData',
        resource = resource,
        ruta = ruta,
        data = data,
        backup = Config.SendFileToDiscord,
    })
end)

RegisterNUICallback('SendBackupUrl', function(data, cb)
    TriggerServerEvent('Roda_ResourceManager:SendBackupUrl', data.url)
end)

RegisterNUICallback('save', function(data, cb)
    TriggerServerEvent('Roda_ResourceManager:Save', data.resource, data.ruta, data.data)
end)