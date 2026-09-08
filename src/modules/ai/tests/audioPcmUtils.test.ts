import {
  float32To16BitPCM,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  pcm16ToFloat32,
} from '../logic/audioPcmUtils';

export function runAudioPcmUtilsTests(): boolean {
  console.log('[Module:AI] Running Audio PCM Utils Unit Tests...');

  // Test 1: Float32 to 16-bit PCM conversion
  const inputFloats = new Float32Array([0.0, 0.5, -0.5, 1.0, -1.0]);
  const pcmBuffer = float32To16BitPCM(inputFloats);
  if (pcmBuffer.byteLength !== inputFloats.length * 2) {
    console.error('[Module:AI] Test 1 Failed: PCM buffer length mismatch');
    return false;
  }
  console.log('[Module:AI] Test 1 Passed: Float32 to Int16 PCM byte length verified');

  // Test 2: Base64 encoding & decoding roundtrip
  const base64 = arrayBufferToBase64(pcmBuffer);
  const decodedBuf = base64ToArrayBuffer(base64);
  if (decodedBuf.byteLength !== pcmBuffer.byteLength) {
    console.error('[Module:AI] Test 2 Failed: Base64 roundtrip length mismatch');
    return false;
  }
  console.log('[Module:AI] Test 2 Passed: Base64 ArrayBuffer roundtrip verified');

  // Test 3: PCM 16 to Float32 conversion
  const int16View = new Int16Array(decodedBuf);
  const backToFloat = pcm16ToFloat32(int16View);
  if (Math.abs(backToFloat[1] - 0.5) > 0.01) {
    console.error('[Module:AI] Test 3 Failed: PCM to Float32 conversion value error');
    return false;
  }
  console.log('[Module:AI] Test 3 Passed: PCM to Float32 normalized values match');

  return true;
}
