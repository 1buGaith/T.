const axios = require('axios');
const http = require('http');

// --- إعداد سيرفر لإبقاء الخدمة حية على Koyeb ---
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('System is Live and Running...\n');
}).listen(process.env.PORT || 8080);

console.log("🌐 Web server active to keep the process alive.");
// --------------------------------------------------

// دالة العد التنازلي المعدلة لتظهر في Logs المواقع السحابية
const countdown = async (seconds) => {
    let remaining = seconds;
    console.log(`⏳ Cooldown started for ${Math.floor(seconds / 60)} minutes.`);
    
    while (remaining > 0) {
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;

        // تحديث السجل كل 5 دقائق (300 ثانية) أو عندما يتبقى أقل من دقيقة
        if (remaining % 300 === 0 || remaining < 60) {
            if (remaining % 60 === 0 || remaining < 10) {
                console.log(`\r⏳ Status: Waiting... ${mins}m ${secs}s left.`);
            }
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        remaining--;
    }
    console.log('\n✅ Time is up! Waking up now...      ');
};

const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

async function startSystem() {
    const creditUrl = 'https://twitter-followers-api.toolkity.com/credit';
    const blastUrl = 'https://twitter-followers-api.toolkity.com/f0lIlO0O0O0Ow/Mhmd1057718';
    
    // التوكن الخاص بك
    const token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTc2MTM0OTY4MzQyMTUxMTY4MCIsImFwcCI6ImZvbGxvd2VycyIsImlhdCI6MTc2NjU2NDEyNCwiZXhwIjoxNzY2NjUwNTI0fQ.FTnkYbNm74O7N7v9hEkQRBDeWoVSDuxEAe3bUIvDzMw';

    let waveCount = 1;
    console.log(`🚀 Ultra-Fast Monitor Active: Target 60 requests per wave.`);

    while (true) { 
        try {
            const res = await axios.get(creditUrl, {
                headers: { 'authorization': token, 'user-agent': userAgents[0] }
            });

            const { credit } = res.data;
            console.log(`\n📊 Status Check -> Current Credits: [${credit}]`);

            if (credit === 0) {
                console.log(`⚠️ Credit is 0. Entering Forced Cooldown (1 Hour)...`);
                await countdown(3615); 
                continue; 
            }

            console.log(`🚀 BLASTING Wave [${waveCount}] - Launching 60 requests...`);
            
            let outOfCreditSignal = false;
            const batch = Array.from({ length: 60 }).map(() => {
                const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];
                return axios.post(blastUrl, null, {
                    headers: {
                        'authorization': token,
                        'user-agent': randomUA,
                        'origin': 'https://toolkity.com',
                        'referer': 'https://toolkity.com/',
                        'accept': '*/*'
                    }
                })
                .then((response) => {
                    const data = JSON.stringify(response.data).toLowerCase();
                    if (data.includes('credit') || data.includes('limit')) outOfCreditSignal = true;
                    process.stdout.write('🟢');
                })
                .catch((err) => {
                    const errData = JSON.stringify(err.response?.data || '').toLowerCase();
                    if (errData.includes('credit') || err.response?.status === 402) outOfCreditSignal = true;
                    process.stdout.write('🔴');
                });
            });

            await Promise.all(batch);
            console.log(`\n✅ Wave ${waveCount} complete.`);

            if (outOfCreditSignal) {
                console.log(`\n⚠️ Detected 'No Credit' during blast. Sleeping...`);
                await countdown(3615);
                continue;
            }

            console.log(`Short 3-minute silence...`);
            await countdown(180);
            
            waveCount++;

        } catch (err) {
            console.log(`\n❌ API Connection Error: ${err.message}. Retrying in 30s...`);
            await new Promise(res => setTimeout(res, 30000));
        }
    }
}

startSystem();
