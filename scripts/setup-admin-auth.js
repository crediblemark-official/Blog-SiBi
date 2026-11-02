#!/usr/bin/env bun
/**
 * Setup Admin Authentication for Blog SiBi CMS
 * 
 * Usage:
 *   bun scripts/setup-admin-auth.js
 *   bun scripts/setup-admin-auth.js --username timSiBi --pin 123456 --token ghp_xxx
 */

import readline from 'node:readline';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.resolve(__dirname, '../public/admin/index.html');

async function prompt(question, isSecret = false) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function encrypt(text, secret) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(text)
  );

  return {
    salt: Buffer.from(salt).toString('base64'),
    iv: Buffer.from(iv).toString('base64'),
    data: Buffer.from(new Uint8Array(encrypted)).toString('base64'),
  };
}

async function main() {
  console.log('\n======================================================');
  console.log('   Kofigurasi Portal Login Admin CMS (Blog SiBi)      ');
  console.log('======================================================\n');
  console.log('Fitur ini mengenkripsi Token GitHub Anda dengan PIN rahasia.');
  console.log('Tim Anda cukup memasukkan Username & PIN untuk mulai menulis.\n');

  // Parse args if any
  const args = process.argv.slice(2);
  let username = '';
  let pin = '';
  let token = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--username' && args[i + 1]) username = args[i + 1];
    if (args[i] === '--pin' && args[i + 1]) pin = args[i + 1];
    if (args[i] === '--token' && args[i + 1]) token = args[i + 1];
  }

  if (!username) {
    username = (await prompt('1. Masukkan Username Tim (default: timSiBi): ')) || 'timSiBi';
  }

  if (!pin) {
    pin = await prompt('2. Masukkan PIN / Kata Sandi Akses Tim (contoh: sibi2026): ');
    if (!pin) {
      console.error('❌ PIN tidak boleh kosong!');
      process.exit(1);
    }
  }

  if (!token) {
    console.log('\nℹ️ Masukkan GitHub Personal Access Token (Classic atau Fine-grained)');
    console.log('  Pastikan token memiliki akses Write ke repo crediblemark-official/Blog-SiBi.');
    token = await prompt('3. Tempel GitHub Token di sini: ');
    if (!token) {
      console.error('❌ Token tidak boleh kosong!');
      process.exit(1);
    }
  }

  console.log('\n🔒 Mengenkripsi token menggunakan AES-256-GCM (PBKDF2 100.000 iterasi)...');
  const encrypted = await encrypt(token, `${username}:${pin}`);

  // Read index.html
  let indexHtml = await fs.readFile(indexPath, 'utf-8');

  // Replace AUTH_CONFIG in index.html
  const authConfigRegex = /const AUTH_CONFIG = \{[\s\S]*?\};/;
  const newConfigStr = `const AUTH_CONFIG = {\n    username: ${JSON.stringify(username)},\n    salt: ${JSON.stringify(encrypted.salt)},\n    iv: ${JSON.stringify(encrypted.iv)},\n    data: ${JSON.stringify(encrypted.data)},\n  };`;

  if (authConfigRegex.test(indexHtml)) {
    indexHtml = indexHtml.replace(authConfigRegex, newConfigStr);
    await fs.writeFile(indexPath, indexHtml, 'utf-8');
    console.log('✅ Konfigurasi berhasil disimpan ke public/admin/index.html!');
  } else {
    console.warn('⚠️ Tidak menemukan placeholder AUTH_CONFIG di public/admin/index.html.');
  }

  console.log('\n======================================================');
  console.log('   🎉 Konfigurasi Berhasil Selesai!                   ');
  console.log('======================================================');
  console.log(`• URL Admin : https://blog.situsbisnis.com/admin/index.html`);
  console.log(`• Username  : ${username}`);
  console.log(`• PIN       : ${pin}`);
  console.log('\nSekarang Anda cukup menjalankan:');
  console.log('  git add . && git commit -m "feat: perbarui auth PIN admin" && git push');
  console.log('Lalu bagikan Username dan PIN di atas ke tim Anda!\n');
}

main().catch(console.error);
