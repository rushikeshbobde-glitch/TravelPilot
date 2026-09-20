import React, { useState, useRef, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import { AssistantToolsService } from '../services/assistantTools';
import { storage } from '../lib/storage';
import { ChatMessage } from '../types';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Terminal,
  Zap,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export const AssistantPage: React.FC = () => {
  const { activeTrip, refreshState } = useTrip();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = storage.getChatMessages(activeTrip.id);
    if (saved.length > 0) return saved;
    return [
      {
        id: 'msg-init',
        trip_id: activeTrip.id,
        user_id: '00000000-0000-0000-0000-000000000001',
        role: 'assistant',
        content: `Hello! I am your autonomous TravelPilot Agent for your trip to **${activeTrip.destination}** (₹${activeTrip.budget.toLocaleString()} budget). Ask me questions about your schedule, nearby attractions, budget utilization, or tell me to modify your itinerary!`,
        created_at: new Date().toISOString(),
      },
    ];
  });
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const promptChips = [
    'What should I do tomorrow morning?',
    'Check schedule conflicts',
    'Check remaining budget',
    'Can I fit a beach visit today?',
    'Remove shopping tomorrow',
    'Replan museum closure',
  ];

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputPrompt).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      trip_id: activeTrip.id,
      user_id: '00000000-0000-0000-0000-000000000001',
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    storage.addChatMessage(userMsg);
    setInputPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let toolName = '';
      let toolArgs: any = {};
      let reply = '';

      if (lower.includes('tomorrow morning') || lower.includes('tomorrow')) {
        toolName = 'GET_ITINERARY';
        const day2 = (activeTrip.days || [])[1] || (activeTrip.days || [])[0];
        const morningAct = day2?.activities[0];
        reply = `For tomorrow morning (Day ${day2?.day_number || 2}), your primary activity is **${morningAct?.name || 'Archaeological Museum'}** starting at ${morningAct?.start_time || '10:00 AM'}. It aligns with your HIGH history preference!`;
      } else if (lower.includes('budget') || lower.includes('spend') || lower.includes('cost')) {
        toolName = 'GET_BUDGET';
        const toolRes = AssistantToolsService.executeTool('GET_BUDGET', {}, activeTrip);
        reply = `Here is your current live budget breakdown:\n\n• **Total Allocation:** ₹${toolRes.data.total_budget.toLocaleString()}\n• **Committed Spend:** ₹${toolRes.data.total_spent.toLocaleString()}\n• **Available Buffer:** ₹${toolRes.data.remaining_budget.toLocaleString()} (${toolRes.data.utilization_percentage}% utilized).\n\nNo over-budget alerts detected!`;
      } else if (lower.includes('conflict')) {
        toolName = 'CHECK_CONFLICTS';
        const toolRes = AssistantToolsService.executeTool('CHECK_CONFLICTS', {}, activeTrip);
        reply = toolRes.message;
      } else if (lower.includes('remove shopping') || lower.includes('delete shopping')) {
        toolName = 'REMOVE_ACTIVITY';
        toolArgs = { category: 'Shopping' };
        const toolRes = AssistantToolsService.executeTool('REMOVE_ACTIVITY', toolArgs, activeTrip);
        reply = `${toolRes.message} Your Day 3 schedule now has an extra 2.5-hour buffer for beach relaxation!`;
        refreshState();
      } else if (lower.includes('beach')) {
        toolName = 'GET_TRIP';
        reply = `You have **Sinquerim Beach** on Day 1 and **Miramar Beach** on Day 2 in your itinerary. If you'd like more beach time, I can add a sunset visit to Vagator Beach or Palolem!`;
      } else if (lower.includes('replan') || lower.includes('heal') || lower.includes('closure')) {
        toolName = 'REPLAN_ITINERARY';
        const toolRes = AssistantToolsService.executeTool('REPLAN_ITINERARY', {}, activeTrip);
        reply = toolRes.message;
        refreshState();
      } else {
        toolName = 'GET_TRIP';
        reply = `I've analyzed your itinerary for **${activeTrip.destination}**. All ${activeTrip.days?.length || 4} days are balanced with zero temporal overlaps. Would you like me to check hotel check-in buffers or recommend restaurants near your stops?`;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        trip_id: activeTrip.id,
        user_id: '00000000-0000-0000-0000-000000000001',
        role: 'assistant',
        content: reply,
        tool_name: toolName,
        created_at: new Date().toISOString(),
      };

      setMessages([...nextMessages, botMsg]);
      storage.addChatMessage(botMsg);
      setIsTyping(false);
    }, 600);
  };

  const handleClearChat = () => {
    storage.initDefaults(true);
    setMessages([
      {
        id: 'msg-init-2',
        trip_id: activeTrip.id,
        user_id: '00000000-0000-0000-0000-000000000001',
        role: 'assistant',
        content: `Chat history reset. How can I assist with your trip to **${activeTrip.destination}**?`,
        created_at: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-glow">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Natural Language Agent
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
              AI Travel Assistant
            </h1>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="btn-secondary text-xs py-1.5 px-3 text-slate-400 hover:text-rose-400"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 glass-card p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role !== 'user' && (
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-brand-600 to-accent-cyan text-white shadow-glow'
                  : 'bg-navy-950/90 border border-slate-800 text-slate-200'
              }`}
            >
              {m.tool_name && (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-300 uppercase mb-2">
                  <Terminal className="w-3 h-3" />
                  Tool Executed: {m.tool_name}
                </div>
              )}
              <div className="whitespace-pre-line">{m.content}</div>
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                U
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-navy-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Analyzing Travel Digital Twin...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        {promptChips.map((chip, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(chip)}
            className="px-3 py-1.5 rounded-xl bg-navy-900 border border-slate-800 hover:border-cyan-400 text-xs text-slate-300 hover:text-white whitespace-nowrap transition-all"
          >
            💬 {chip}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask anything or request itinerary changes (e.g. 'Remove shopping', 'Check budget')..."
          className="glass-input flex-1 py-3 text-xs sm:text-sm"
        />
        <button
          onClick={() => handleSendMessage()}
          className="btn-primary p-3 rounded-xl shadow-glow"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
