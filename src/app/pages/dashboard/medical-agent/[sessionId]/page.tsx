'use client';
export const runtime = 'edge';
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { getSessionAction, postMessageAction } from "@/app/actions/sessions";
import { getDoctorPhoneAction } from "@/app/actions/doctors";
import { Circle, PhoneCall, PhoneOff, Send, Loader2, MessageSquare, Users, Mic, Volume2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";

interface Props {
  // propName: string
}

type SessionDetail = {
  id: number,
  notes: string,
  sessionId: string,
  report: JSON,
  selectedDoctor: any,
  conversation: any[],
  createdOn: string
}

type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
}


const MedicalVoiceAgent: React.FC<Props> = (props) => {
  const { sessionId } = useParams()
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [callType, setCallType] = useState<'ai-voice' | 'ai-text' | 'real' | null>(null);
  const [showCallTypeDialog, setShowCallTypeDialog] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [doctorPhoneNumber, setDoctorPhoneNumber] = useState<string>('Loading...');
  
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const callTypeRef = useRef(callType);
  const [canSpeak, setCanSpeak] = useState(false);
  
  // Update ref when callType changes
  useEffect(() => {
    callTypeRef.current = callType;
  }, [callType]);
  
  // Test if browser can speak (required for some browsers)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const testUtterance = new SpeechSynthesisUtterance('');
      testUtterance.volume = 0;
      window.speechSynthesis.speak(testUtterance);
      window.speechSynthesis.cancel();
      setCanSpeak(true);
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition && !recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'vi-VN,en-US';

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript && callTypeRef.current === 'ai-voice') {
            autoSendMessage(finalTranscript);
          } else if (finalTranscript) {
            setMessage(finalTranscript);
          }
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          if (isListening) {
            try {
              recognitionRef.current?.start();
            } catch (error) {
              console.error('Speech recognition already running:', error);
            }
          }
        };
      }

      synthRef.current = window.speechSynthesis;
    }
  }, [isListening]);

  const speak = (text: string) => {
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis && text) {
        let sanitizedText = text
          .replace(/\*/g, '')
          .replace(/#/g, '')
          .replace(/\[/g, '').replace(/\]/g, '')
          .replace(/\(/g, '').replace(/\)/g, '')
          .replace(/_{2,}/g, '')
          .replace(/[/|]/g, '')
          .trim();
        
        if (sanitizedText.length > 10000) {
          sanitizedText = sanitizedText.substring(0, 10000) + '...';
        }
        
        window.speechSynthesis.cancel();
        setTimeout(() => {
          const isVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/.test(sanitizedText);
          
          const utterance = new SpeechSynthesisUtterance(sanitizedText);
          utterance.lang = isVietnamese ? 'vi-VN' : 'en-US';
          utterance.rate = isVietnamese ? 0.85 : 0.9;
          utterance.pitch = isVietnamese ? 1.1 : 1.0;
          utterance.volume = 0.33;
          
          if (isVietnamese) {
            const voices = window.speechSynthesis.getVoices();
            const vietnameseVoice = voices.find(voice => 
              voice.lang.startsWith('vi') || 
              voice.name.toLowerCase().includes('vietnamese') ||
              voice.name.toLowerCase().includes('vietnam')
            );
            if (vietnameseVoice) {
              utterance.voice = vietnameseVoice;
            }
          }
        
          utterance.onstart = () => {
            setIsSpeaking(true);
          };
        
          utterance.onend = () => {
            setIsSpeaking(false);
          };
        
          utterance.onerror = (event: any) => {
            if (event.error !== 'interrupted') {
              console.warn('Speech synthesis error:', event.error);
            }
            setIsSpeaking(false);
          };
        
          window.speechSynthesis.speak(utterance);
        }, 200);
      }
    } catch (error) {
      console.error('Error in speak function:', error);
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    sessionId && GetSessionDetails()
  }, [sessionId])

  useEffect(() => {
    if (sessionDetail?.conversation) {
      setConversation(sessionDetail.conversation);
    }
  }, [sessionDetail])

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation])

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  useEffect(() => {
    if (callType === 'ai-voice' && recognitionRef.current) {
      if (isSpeaking) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('Error stopping recognition:', error);
        }
      } else {
        const restartTimeout = setTimeout(() => {
          if (recognitionRef.current && callType === 'ai-voice') {
            try {
              recognitionRef.current.start();
            } catch (error) {
              console.log('Recognition already running or not ready yet');
            }
          }
        }, 1000);
        
        return () => clearTimeout(restartTimeout);
      }
    }
  }, [isSpeaking, callType]);

  const GetSessionDetails = async () => {
    const result: any = await getSessionAction(sessionId as string)
    setSessionDetail(result)
    if (result?.conversation) {
      setConversation(result.conversation as any);
    }
  }

  const autoSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    setIsLoading(true);

    const newMessage: ConversationMessage = { role: 'user', content: userMessage };
    setConversation(prev => [...prev, newMessage]);

    try {
      const result: any = await postMessageAction(sessionId as string, userMessage);

      const assistantMessage: ConversationMessage = { role: 'assistant', content: result.response };
      setConversation(prev => [...prev, assistantMessage]);
      
      if ((callType === 'ai-voice' || callTypeRef.current === 'ai-voice') && result.response) {
        setTimeout(() => {
          speak(result.response);
        }, 300);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ConversationMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || isLoading) return;

    await autoSendMessage(message);
    setMessage('');
  }

  const handleStartCall = () => {
    setShowCallTypeDialog(true);
  }

  const handleSelectCallType = (type: 'ai-voice' | 'ai-text' | 'real') => {
    setCallType(type);
    setIsCallActive(true);
    setIsConnected(true);
    setCallDuration(0);
    setShowCallTypeDialog(false);
    
    if (type === 'ai-voice' || type === 'ai-text') {
      const greeting = `Hello! I'm your AI Agent assistant. How can I help you today?`;
      const greetingMessage: ConversationMessage = {
        role: 'assistant',
        content: greeting
      };
      setConversation([greetingMessage]);
      
      if (type === 'ai-voice') {
        setTimeout(() => {
          if (recognitionRef.current && !isListening) {
            try {
              recognitionRef.current.start();
              setIsListening(true);
            } catch (error) {
              console.error('Error starting speech recognition:', error);
            }
          }
        }, 500);
        speak(greeting);
      }
    } else if (type === 'real') {
      getDoctorPhoneNumber().then(phone => {
        if (phone) {
          setDoctorPhoneNumber(phone);
        }
      });
    }
  }

  const getDoctorPhoneNumber = async () => {
    if (!sessionDetail?.selectedDoctor?.id) {
      return null;
    }
    
    try {
      const result: any = await getDoctorPhoneAction(sessionDetail.selectedDoctor.id);
      return result.phoneNumber;
    } catch (error) {
      console.error('Error fetching doctor phone:', error);
      return null;
    }
  }

  const handleStopCall = () => {
    setIsCallActive(false);
    setIsConnected(false);
    setCallDuration(0);
    setCallType(null);
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }
  
  const toggleListening = () => {
    if (!isListening) {
      recognitionRef.current?.start();
      setIsListening(true);
    } else {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <div className="p-10 border rounded-3xl bg-secondary">
      <div className="flex justify-between items-center">
        <h2 className={`p-1 px-2 border rounded-md flex gap-2 items-center ${isConnected ? 'bg-green-100 text-green-700 border-green-300' : ''}`}>
          <Circle className={`h-4 w-4 ${isConnected ? 'fill-green-500 text-green-500' : ''}`} /> 
          {isConnected ? 'Connected' : 'Not Connected'}
        </h2>
        <h2 className="font-bold text-gray-400">{formatTime(callDuration)}</h2>
      </div>
      <div className="flex items-center flex-col">
        {sessionDetail?.selectedDoctor?.image ? (
          <Image src={sessionDetail.selectedDoctor.image} alt={sessionDetail.selectedDoctor.specialist || 'Doctor'} height={120} width={120} className="object-cover h-[100px] w-[100px] rounded-full" />
        ) : (
          <div className="h-[100px] w-[100px] rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-4xl">👨‍⚕️</span>
          </div>
        )}
        <h2 className="mt-2 text-lg">{sessionDetail?.selectedDoctor?.specialist || 'Medical Agent'}</h2>
        <p className="text-sm text-gray-400">AI Medical Voice Agent</p>

        {/* Conversation Display */}
        <div className="mt-10 w-full max-w-2xl max-h-64 overflow-y-auto space-y-4 px-4">
          {conversation.length === 0 ? (
            <p className="text-center text-gray-500">Start a call to begin conversation</p>
          ) : (
            conversation.map((msg, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-lg break-words ${
                  msg.role === 'user' 
                    ? 'bg-blue-100 ml-auto max-w-[80%]' 
                    : 'bg-gray-100 mr-auto max-w-[80%]'
                }`}
              >
                <p className="text-sm text-gray-800 break-words whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin h-4 w-4" />
              <span className="ml-2 text-sm text-gray-500">AI is thinking...</span>
            </div>
          )}
          <div ref={conversationEndRef} />
        </div>

        {/* Voice Status Indicators */}
        {isCallActive && callType === 'ai-voice' && (
          <div className="mt-4 flex gap-4 items-center">
            {isListening && (
              <div className="flex items-center gap-2 text-red-600">
                <Mic className="h-5 w-5 animate-pulse" />
                <span className="text-sm">Listening...</span>
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center gap-2 text-blue-600">
                <Volume2 className="h-5 w-5 animate-pulse" />
                <span className="text-sm">AI is speaking...</span>
              </div>
            )}
          </div>
        )}

        {/* Message Input */}
        {isCallActive && (callType === 'ai-text' || (callType === 'ai-voice' && !isListening)) && (
          <form onSubmit={sendMessage} className="mt-6 w-full max-w-2xl flex gap-2 px-4">
            <Textarea
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
              rows={2}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !message.trim()}>
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        )}
        
        {/* Voice Mode Controls */}
        {isCallActive && callType === 'ai-voice' && (
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={toggleListening}
              className={isListening ? 'bg-red-50 border-red-200' : ''}
            >
              <Mic className={`h-4 w-4 mr-2 ${isListening ? 'animate-pulse' : ''}`} />
              {isListening ? 'Stop Listening' : 'Start Voice Input'}
            </Button>
            <Button
              variant="outline"
              onClick={() => speak('Hello, this is a test of the speech system. Can you hear me?')}
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Test Voice
            </Button>
          </div>
        )}

        {/* Real Doctor Call Status */}
        {isCallActive && callType === 'real' && (
          <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-center">
              <p className="text-blue-800 font-semibold text-lg mb-2">
                🔔 Connect with Real Doctor
              </p>
              <p className="text-sm text-blue-600 mb-6">
                Doctor: {sessionDetail?.selectedDoctor?.specialist || 'Medical Professional'}
              </p>
              
              <div className="flex gap-3 justify-center flex-wrap">
                <Button
                  onClick={() => {
                    let formattedPhone = doctorPhoneNumber;
                    if (doctorPhoneNumber.startsWith('0')) {
                      formattedPhone = '84' + doctorPhoneNumber.substring(1);
                    }
                    window.location.href = `zalo://call?phone=${formattedPhone}`;
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  📞 Call via Zalo
                </Button>
                <Button
                  onClick={() => {
                    let formattedPhone = doctorPhoneNumber;
                    if (doctorPhoneNumber.startsWith('0')) {
                      formattedPhone = '84' + doctorPhoneNumber.substring(1);
                    }
                    window.location.href = `zalo://chat?phone=${formattedPhone}`;
                  }}
                  variant="outline"
                  className="border-blue-500 text-blue-600 hover:bg-blue-100"
                >
                  💬 Message via Zalo
                </Button>
                <Button
                  onClick={() => window.location.href = `tel:${doctorPhoneNumber}`}
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-100"
                >
                  ☎️ Phone Call
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                Please have Zalo installed on your device for best experience
              </p>
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="mt-6">
          {isCallActive ? (
            <Button 
              className="bg-red-600 hover:bg-red-700" 
              onClick={handleStopCall}
            > 
              <PhoneOff /> {callType === 'real' ? 'End Call' : 'Stop Call'}
            </Button>
          ) : (
            <Button onClick={handleStartCall}>
              <PhoneCall /> Start Consultation
            </Button>
          )}
        </div>
      </div>

      {/* Call Type Selection Dialog */}
      <Dialog open={showCallTypeDialog} onOpenChange={setShowCallTypeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Consultation Type</DialogTitle>
            <DialogDescription>
              How would you like to interact with the medical professional?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-start gap-2 hover:bg-blue-50"
              onClick={() => handleSelectCallType('ai-voice')}
            >
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                <span className="font-semibold">Voice Call with AI Agent</span>
              </div>
              <span className="text-sm text-gray-600 text-left break-words whitespace-normal">
                Have a voice conversation with our AI-powered medical assistant. Speak naturally and get instant voice responses with transcript.
              </span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-start gap-2 hover:bg-purple-50"
              onClick={() => handleSelectCallType('ai-text')}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <span className="font-semibold">Text Chat with AI Agent</span>
              </div>
              <span className="text-sm text-gray-600 text-left break-words whitespace-normal">
                Chat via text with our AI-powered medical assistant. Get instant written responses.
              </span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-start gap-2 hover:bg-green-50"
              onClick={() => handleSelectCallType('real')}
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="font-semibold">Call Real Doctor</span>
              </div>
              <span className="text-sm text-gray-600 text-left break-words whitespace-normal">
                Connect with a licensed medical professional via voice call
              </span>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCallTypeDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalVoiceAgent;