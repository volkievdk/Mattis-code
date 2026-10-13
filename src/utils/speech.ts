export function speak(text: string, rate = 1, pitch = 1.2): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'nl-NL';
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function speakShort(text: string): void {
  speak(text, 1.12, 1.5);
}

export function speakCodingExplanation(childName: string): void {
  const name = childName || 'programmeur';
  const text = [
    `Hoi ${name}. Ik leg uit hoe coderen werkt.`,
    'Code is een plan voor de computer.',
    'De computer leest jouw code van boven naar beneden.',
    'Eén regel code doet één ding.',
    'Rechts met haakjes betekent: ga één stap naar rechts.',
    'Omlaag met haakjes betekent: ga één stap omlaag.',
    'De volgorde is belangrijk.',
    'Foutjes zijn normaal.',
    'Een foutje zoeken en verbeteren heet debuggen.',
    'Probeer. Kijk. Verbeter. Programmeer.',
  ].join(' ');
  speak(text, 0.9, 1.15);
}
