function FocusBlur(bool)
    SetNuiFocus(bool, bool)
    if bool then
        SetTimecycleModifier('hud_def_blur') -- blur
    else
        SetTimecycleModifier('default')
    end
end