#!/bin/bash
npx cap sync
ionic capacitor update
npx cap update
ionic build
ionic capacitor copy android
