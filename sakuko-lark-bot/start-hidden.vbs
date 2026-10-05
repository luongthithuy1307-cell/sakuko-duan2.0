' Chay bot an (khong hien cua so). Tu tim thu muc chua file nay -> chay dung du dat o C: hay D:
Set fso = CreateObject("Scripting.FileSystemObject")
folder = fso.GetParentFolderName(WScript.ScriptFullName)
CreateObject("WScript.Shell").Run "cmd /c """ & folder & "\run-bot.bat""", 0, False
