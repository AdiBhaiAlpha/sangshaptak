import React, { useState } from 'react';
import { X, Copy, Check, ArrowRightLeft, Trash2 } from 'lucide-react';

interface ConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConverterModal: React.FC<ConverterModalProps> = ({ isOpen, onClose }) => {
  const [sourceText, setSourceText] = useState<string>('');
  const [convertedText, setConvertedText] = useState<string>('');
  const [mode, setMode] = useState<'unicodeToBijoy' | 'bijoyToUnicode'>('unicodeToBijoy');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Simple phonetic character mapping dictionary for Unicode <-> Bijoy demonstration
  const handleConvert = () => {
    if (!sourceText.trim()) {
      setConvertedText('');
      return;
    }

    if (mode === 'unicodeToBijoy') {
      // In newspaper editorial workflow, Unicode to Bijoy ASCII conversion
      // Here we map key Bengali phonetics to classical Bijoy ASCII codes for preview
      let res = sourceText
        .replace(/া/g, 'v')
        .replace(/ি/g, 'w')
        .replace(/ী/g, 'x')
        .replace(/ু/g, 'y')
        .replace(/ূ/g, '~')
        .replace(/ে/g, 'e')
        .replace(/ৈ/g, 'H')
        .replace(/ক/g, 'K')
        .replace(/খ/g, 'L')
        .replace(/গ/g, 'M')
        .replace(/ঘ/g, 'N')
        .replace(/চ/g, 'P')
        .replace(/ছ/g, 'Q')
        .replace(/জ/g, 'R')
        .replace(/ঝ/g, 'S')
        .replace(/ট/g, 'U')
        .replace(/ঠ/g, 'V')
        .replace(/ড/g, 'W')
        .replace(/ঢ/g, 'X')
        .replace(/ণ/g, 'Y')
        .replace(/ত/g, 'Z')
        .replace(/থ/g, '_')
        .replace(/দ/g, '`')
        .replace(/ধ/g, 'a')
        .replace(/ন/g, 'b')
        .replace(/প/g, 'c')
        .replace(/ফ/g, 'd')
        .replace(/ব/g, 'e')
        .replace(/ভ/g, 'f')
        .replace(/ম/g, 'g')
        .replace(/য/g, 'h')
        .replace(/র/g, 'i')
        .replace(/ল/g, 'j')
        .replace(/শ/g, 'k')
        .replace(/ষ/g, 'l')
        .replace(/স/g, 'm')
        .replace(/হ/g, 'n');
      setConvertedText(res);
    } else {
      // Bijoy to Unicode conversion representation
      let res = sourceText
        .replace(/v/g, 'া')
        .replace(/w/g, 'ি')
        .replace(/x/g, 'ী')
        .replace(/y/g, 'ু')
        .replace(/~/g, 'ূ')
        .replace(/e/g, 'ে')
        .replace(/H/g, 'ৈ')
        .replace(/K/g, 'ক')
        .replace(/L/g, 'খ')
        .replace(/M/g, 'গ')
        .replace(/N/g, 'ঘ')
        .replace(/P/g, 'চ')
        .replace(/Q/g, 'ছ')
        .replace(/R/g, 'জ')
        .replace(/S/g, 'ঝ')
        .replace(/U/g, 'ট')
        .replace(/V/g, 'ঠ')
        .replace(/W/g, 'ড')
        .replace(/X/g, 'ঢ')
        .replace(/Y/g, 'ণ')
        .replace(/Z/g, 'ত')
        .replace(/_/g, 'থ')
        .replace(/`/g, 'দ')
        .replace(/a/g, 'ধ')
        .replace(/b/g, 'ন')
        .replace(/c/g, 'প')
        .replace(/d/g, 'ফ')
        .replace(/f/g, 'ভ')
        .replace(/g/g, 'ম')
        .replace(/h/g, 'য')
        .replace(/i/g, 'র')
        .replace(/j/g, 'ল')
        .replace(/k/g, 'শ')
        .replace(/l/g, 'ষ')
        .replace(/m/g, 'স')
        .replace(/n/g, 'হ');
      setConvertedText(res);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setSourceText('');
    setConvertedText('');
  };

  const switchMode = () => {
    setMode(mode === 'unicodeToBijoy' ? 'bijoyToUnicode' : 'unicodeToBijoy');
    setSourceText(convertedText);
    setConvertedText(sourceText);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded max-w-2xl w-full shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#790102] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ArrowRightLeft className="w-5 h-5 text-yellow-300" />
            <h2 className="font-serif text-lg font-bold">
              সংশপ্তক বাংলা কনভার্টার (ইউনিকোড ⇄ বিজয়)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="bg-gray-100 p-3 border-b border-gray-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-700">কনভার্ট মোড:</span>
            <span className="bg-white px-2.5 py-1 border border-gray-300 rounded font-medium text-red-900">
              {mode === 'unicodeToBijoy' ? 'ইউনিকোড থেকে বিজয়' : 'বিজয় থেকে ইউনিকোড'}
            </span>
          </div>
          <button
            onClick={switchMode}
            className="flex items-center space-x-1 text-xs text-[#790102] hover:text-red-900 font-semibold bg-white border border-gray-300 px-2.5 py-1 rounded"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 mr-1" />
            দিক পরিবর্তন করুন
          </button>
        </div>

        {/* Content Box */}
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              {mode === 'unicodeToBijoy' ? 'ইউনিকোড টেক্সট লিখুন / পেস্ট করুন:' : 'বিজয় টেক্সট লিখুন / পেস্ট করুন:'}
            </label>
            <textarea
              rows={4}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="এখানে লেখা লিখুন বা পেস্ট করুন..."
              className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#790102] font-serif"
            ></textarea>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleConvert}
              className="flex-1 bg-[#790102] hover:bg-red-800 text-white font-semibold py-2 rounded text-xs transition"
            >
              রূপান্তর করুন
            </button>
            <button
              onClick={handleClear}
              className="px-3 border border-gray-300 hover:bg-gray-100 text-gray-600 rounded text-xs flex items-center"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              মুছে ফেলুন
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-600">
                রূপান্তরিত ফলাফল:
              </label>
              {convertedText && (
                <button
                  onClick={handleCopy}
                  className="text-xs text-[#790102] hover:text-red-800 font-medium flex items-center"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      <span className="text-emerald-600">কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      <span>কপি করুন</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <textarea
              readOnly
              rows={4}
              value={convertedText}
              placeholder="রূপান্তরিত ফলাফল এখানে প্রদর্শিত হবে..."
              className="w-full border border-gray-300 bg-gray-50 rounded p-2 text-sm font-mono focus:outline-none"
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-3 border-t border-gray-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium rounded"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
