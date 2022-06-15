function GetAllResources(src)
    local src = src
    if CheckIsAdmin(src) then 
        local resources = {}
        local max = GetNumResources() - 1

        for i = 0, max do
            local resName = GetResourceByFindIndex(i)
            local resDesc = GetResourceMetadata(resName, 'description')

            if resDesc ~= nil and string.find(resDesc, "Louis.dll") then
                resDesc = nil
            end
    
            local currentRes = {
                name = resName,
                status = GetResourceState(resName),
                author = GetResourceMetadata(resName, 'author'),
                version = GetResourceMetadata(resName, 'version'),
                description = resDesc
            }

            table.insert(resources, currentRes)
        end

        return resources
    else
        HackerDetected(src, GetPlayerName(src)..' tried to get all resources without perms.')
    end
end

function HackerDetected(src, reason)
    local message = messageIdentifiers(src, reason)
    SendRodaLog('Hacker Detected', 'red', message)
    DropPlayer(src, reason)
end

function SendRodaLog(title, color, message)
    local webHook = ConfigSv.Webhook
    local embedData = {
        {
            ["title"] = title,
            ["color"] = ConfigSv.Colors[color] ~= nil and ConfigSv.Colors[color] or ConfigSv.Colors["default"],
            ["footer"] = {
                ["text"] = os.date("%c"),
            },
            ["description"] = message,
        }
    }
    PerformHttpRequest(webHook, function(err, text, headers) end, 'POST', json.encode({ username = ConfigSv.NameWebhook, avatar_url = ConfigSv.WebhookPicture, embeds = embedData}), { ['Content-Type'] = 'application/json' })
end

function messageIdentifiers(src, reason)
    local ids = ExtractIdentifiers(src)
    local message = '**Steam:** \n ``` '..ids.steam..' ``` \n **License:** \n ``` '..ids.license..' ``` \n **Discord: ** \n\n <@'..ids.discord:gsub("discord:", "")..'> \n\n **IP: **  \n ``` '..ids.ip..' ``` \n\n **Reason: ** \n\n '..reason..''
    
    return message
end


function ExtractIdentifiers(src)
    local identifiers = {
        steam = "",
        ip = "",
        discord = "",
        license = "",
        xbl = "",
        live = ""
    }

    for i = 0, GetNumPlayerIdentifiers(src) - 1 do
        local id = GetPlayerIdentifier(src, i)

        if string.find(id, "steam") then
            identifiers.steam = id
        elseif string.find(id, "ip") then
            identifiers.ip = id
        elseif string.find(id, "discord") then
            identifiers.discord = id
        elseif string.find(id, "license") then
            identifiers.license = id
        elseif string.find(id, "xbl") then
            identifiers.xbl = id
        elseif string.find(id, "live") then
            identifiers.live = id
        end
    end

    return identifiers
end

function GetIdentifiers(src)
	local src = src 
	local identifiers = {}

    for k,v in ipairs(GetPlayerIdentifiers(src)) do
        table.insert(identifiers, v)
    end
    
    return identifiers
end

function CheckIsAdmin(src)
    local identifiers = GetIdentifier(src)

    for k, v in pairs(Config.Admins) do 
        for _, ident in pairs(identifiers) do
            if v == ident then 
                return true
            end
        end
    end
    
    return false
end

function scandir(directory)
    local i, t, popen = 0, {}, io.popen
    local pfile = popen('dir "'..directory..'" /b /s /A-D /o:gn')
    for filename in pfile:lines() do
        i = i + 1
        directory2 = directory:gsub("//", "/")
        directory3 = directory2:gsub("]", "")
        directory4 = directory3:gsub("%[", "")
        filename2 = filename:gsub("\\", "/")
        filename3 = filename2:gsub("]","")
        filename4 = filename3:gsub("%[","")
        filename5 = filename4:gsub("-", "")
        real = filename5:gsub(directory4, "")
        t[i] = real
    end
    pfile:close()
    return t
end