# 🎯 FINAL INSTRUCTIONS - Copy & Paste These Commands

## The Issue is Fixed! Here's What to Do:

---

## STEP 1: Open PowerShell in Your Forensic Folder

1. Open File Explorer
2. Navigate to: `C:\Users\vanan\FORENSIC`
3. Right-click in empty space
4. Click "Open PowerShell window here"

OR press `Win+X` then `I` for PowerShell, then:
```powershell
cd C:\Users\vanan\FORENSIC
```

---

## STEP 2: Run This ONE Command

Copy and paste this into PowerShell:

```powershell
.\deploy.ps1 -Action deploy
```

Press Enter and wait.

---

## STEP 3: Wait for Completion

You'll see lots of output. Wait until you see this:

```
==========================================
✅ DEPLOYMENT COMPLETE!
==========================================

🌐 Access the application:
   Frontend:  http://localhost:3001
   Backend:   http://localhost:5000
   Ganache:   http://localhost:8545
   IPFS:      http://localhost:8081
```

This takes 2-5 minutes the first time. That's normal! ☕

---

## STEP 4: Open the Application

1. Open your web browser
2. Go to: **http://localhost:3001**
3. Login with your admin account
4. Try uploading evidence

**It should work now!** 🎉

---

## STEP 5: Test to Confirm It's Fixed

In the app:
1. Go to "Submit New Evidence"
2. Create a new case (if you haven't)
3. Select a file to upload
4. Enter the case ID
5. Click "LOCK EVIDENCE IN LEDGER"

**Result:** Should succeed without the blockchain error! ✅

---

## If Something Goes Wrong

### Issue 1: "PowerShell is not recognizing..."
Try this instead (Windows CMD):
```cmd
deploy.bat
```

### Issue 2: "Port 5000 already in use"
```powershell
# Stop existing containers first
docker-compose down

# Then run again
.\deploy.ps1 -Action deploy
```

### Issue 3: "Containers are running but still getting blockchain error"
```powershell
# Full reset
docker-compose down -v

# Fresh start
.\deploy.ps1 -Action deploy
```

### Issue 4: Takes too long (> 10 minutes)
```powershell
# Stop it (Ctrl+C)
# Then check status
docker-compose ps

# View logs
docker-compose logs backend
```

---

## After It's Working

### To Stop the System
Press **Ctrl+C** in the PowerShell window

### To Start Again Later
```powershell
docker-compose up
```

### To See What's Happening
```powershell
docker-compose logs -f
```

### To Reset Everything (Delete all data)
```powershell
docker-compose down -v
.\deploy.ps1 -Action deploy
```

---

## Files to Reference Later

- 📖 `QUICK_START.md` - Fast overview
- 📖 `BLOCKCHAIN_DEPLOYMENT.md` - How deployment works
- 📖 `TROUBLESHOOTING.md` - Common issues
- 📖 `CHANGES_SUMMARY.md` - What code changed

---

## That's It! 🚀

The fix is ready. Just run that one command and you're done!

**Questions?** Check `TROUBLESHOOTING.md` in the same folder.
