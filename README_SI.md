# ගෝනගමුව ස්ටෝර්ස් — Windows Offline v4 (Simple Manual Backup)

මෙය කලින් වැඩ කළ v4 Tauri + SQLite Project එක මත පදනම් කරගෙන Backup UI/ක්‍රියාවලිය පමණක් සරල කළ Source Project එකකි.

## Backup / Restore

- **Settings → Data → Backup ලබාගන්න:** හැම වතාවකම Windows Save As dialog එකක් විවෘත වේ. PC, USB හෝ Google Drive for desktop මගින් sync වන folder එකක් තෝරා JSON backup එක සුරකින්න.
- **Settings → Data → Backup නැවත ඇතුළත් කරන්න:** JSON file එක තෝරා Preview/Confirm කළ පසු පවතින data replace වේ. Restore කිරීමට පෙර අවශ්‍ය නම් Manual Backup එකක් ගන්න.
- ස්වයංක්‍රීය daily/exit backup, folder setup, සහ last 30 days history නැත.
- App එකේ සාමාන්‍ය save කිරීම SQLite තුළ සිදු වේ. Close කරන විට pending saves සම්පූර්ණ වන තුරු සිටී.
- Google Drive upload සිදුවන්නේ වෙනම Google Drive for desktop application එක මගින් පමණි. Cloud sync status එහි පරීක්ෂා කරන්න.

## Windows Installer Build

1. ZIP extract කර `.github`, `src-tauri`, `web`, `package.json` ඇතුළු files GitHub repository root එකට upload කරන්න.
2. Actions → **Build Tauri Windows EXE** → Run workflow.
3. Build success වුණාම Artifacts වෙතින් `.exe` Installer එක download කරන්න.

මෙය source ZIP එකකි. මෙහි Windows/Rust toolchain එක නොමැති නිසා EXE compile/run test කරලා නැත. පරණ v4 එක සහ දත්ත backup ආරක්ෂා කරගෙන මුලින් test කරන්න.
