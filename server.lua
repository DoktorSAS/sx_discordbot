AddEventHandler('chatMessage', function(source, name, msg)
    local player = GetPlayerIdentifier(source)
    --MySQL.Async.execute("INSERT INTO sx_log (msg_auhtor, msg_text) VALUES(@author, @msg)", {['@author'] = name, ['@msg'] = msg})
end)
