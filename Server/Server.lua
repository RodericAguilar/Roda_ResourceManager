RegisterCommand('rm', function(source)
    local src = source
    local access = CheckIsAdmin(src)

    if access then 
        local resources = GetAllResources(src)
        TriggerClientEvent('Roda_ResourceManager:OpenUi', src, resources)
    end
end)

RegisterServerEvent('Roda_ResourceManager:EditResource')
AddEventHandler('Roda_ResourceManager:EditResource', function (resource)
    local src = source
    local access = CheckIsAdmin(src)
    if access then 
        local resource1 = LoadResourceFile(resource, "__resource.lua")
        local resource2 = LoadResourceFile(resource, "fxmanifest.lua")
        if resource1 or resource2 then
            local recurso = scandir(GetResourcePath(resource))
            directorio = GetResourcePath(resource)
            TriggerClientEvent('Roda_ResourceManager:OpenEdit', src, recurso)
        end
    else
        HackerDetected(src, GetPlayerName(src)..' tried to edit resources without permission.')
    end
end)

RegisterServerEvent('Roda_ResourceManager:Accion')
AddEventHandler('Roda_ResourceManager:Accion', function (resource, accion)
    local src = source
    local access = CheckIsAdmin(src)
    if access then 
        if accion == 'start' then 
            StartResource(resource)
            SendRodaLog('Start Resource', 'green', 'The resource **'..resource..'** was started by **'..GetPlayerName(src)..' · '..src..'** ')
        elseif accion == 'stop' then 
            StopResource(resource)
            SendRodaLog('Stop Resource', 'green', 'The resource **'..resource..'** was stopped by **'..GetPlayerName(src)..' · '..src..'** ')
        elseif accion == 'restart' then 
            StopResource(resource)
            StartResource(resource)
            SendRodaLog('Restart Resource', 'blue', 'The resource **'..resource..'** was restarted by **'..GetPlayerName(src)..' · '..src..'** ')
        end
    else
        HackerDetected(src, 'Try to manage resources without permission')
    end
end)


RegisterServerEvent('Roda_ResourceManager:GetData')
AddEventHandler('Roda_ResourceManager:GetData', function (resource, ruta)
    local src = source
    local access = CheckIsAdmin(src)
    local extension = nil
    if access then 
        local loadedResource = LoadResourceFile(resource, ruta)
        if loadedResource then
            TriggerClientEvent('Roda_ResourceManager:SendData', src, resource, ruta, loadedResource)
            if Config.MakeBackup then

                if string.find(ruta, '.lua') then 
                    extension = '.lua'
                elseif string.find(ruta, '.js') then
                    extension = '.js'
                elseif string.find(ruta, '.css') then
                    extension = '.css'
                elseif string.find(ruta, '.html') then
                    extension = '.html'
                end
            
                if Config.SendFileToDiscord then 
                    SendRodaLog('Save Backup in Discord', 'red', 'The resource **'..resource..'** make a backup for **'..resource..''..ruta..'** ')
                    exports['Roda_ResourceManager']:sendData(GetResourcePath(resource)..ruta, ConfigSv.Webhook)
                else
                    SendRodaLog('Save Backup in Folder', 'red', 'The resource **'..resource..'** make a backup for **'..resource..''..ruta..'** ')
                   -- Thanks to guillerp! for this code.
                    SaveResourceFile(resource, ruta.."-security"..math.random(1, 300000000)..""..extension.."", loadedResource, -1)
                end
 
            end
        end
    else
        HackerDetected(src, 'Try to get data from resources without permission')
    end
end)

RegisterServerEvent('Roda_ResourceManager:SendBackupUrl')
AddEventHandler('Roda_ResourceManager:SendBackupUrl', function (url)
    local src = source
    local access = CheckIsAdmin(src)

    if access then 
        SendRodaLog('File url', 'red', url)
    else
        HackerDetected(src, 'Try to send webhook without perms')
    end
end)

RegisterServerEvent('Roda_ResourceManager:Save')
AddEventHandler('Roda_ResourceManager:Save', function (resource, ruta, data)
    local src = source
    local access = CheckIsAdmin(src)

    if access then
        SaveResourceFile(resource, ruta, data, -1)
        if Config.AutoRestart then 
            StopResource(resource)
            StartResource(resource)
        end
        SendRodaLog('Save and Edit File', 'green', 'The admin '..GetPlayerName(src)..' · '..src..' edited the file **'..resource..''..ruta..'** ')
    else
        HackerDetected(src, 'Try to save data without permission')
    end
end)