import React, { useState, useRef } from 'react';
import { Button } from '../../components/Button';
import { Edit2, Image as ImageIcon, Save, ArrowLeft, Upload, Check, AlertCircle, FileText, X, CheckCircle2 } from 'lucide-react';

// Mock content data structure for the CMS
const MOCK_CONTENT = {
  'home': {
    title: 'Home Page',
    sections: [
      { id: 'hero', label: 'Hero Section', fields: { headline: 'Accelerate Growth with Intelligent Automation', subtext: 'MarketBridge AI unifies your campaign management, CRM, and omnichannel messaging into one beautiful, intelligent interface.' } },
      { id: 'features', label: 'Features Grid', fields: { title: 'Omnichannel Messaging', description: 'Connect WhatsApp, Messenger, and Email in a single inbox.' } }
    ]
  },
  'about': {
    title: 'About Us',
    sections: [
      { id: 'mission', label: 'Mission Statement', fields: { text: 'At MarketBridge AI, our mission is to empower businesses of every size...' } },
      { id: 'story', label: 'Company Story', fields: { text: 'MarketBridge AI is a flagship brand of Matrix Infotech Ltd...' } }
    ]
  },
  'features': {
      title: 'Features',
      sections: [
          { id: 'hero', label: 'Header', fields: { title: 'Everything you need to Scale Your Growth', subtitle: 'MarketBridge AI provides a complete suite of tools...'}}
      ]
  },
  'products': {
      title: 'Products',
      sections: [
          { id: 'hero', label: 'Header', fields: { title: 'The MarketBridge Product Suite', subtitle: 'A modular ecosystem of tools designed to work together seamlessly.'}}
      ]
  },
  'pricing': {
      title: 'Pricing',
      sections: [
          { id: 'hero', label: 'Header', fields: { title: 'Simple pricing, Unbeatable Value', subtitle: 'We believe advanced marketing tools should be accessible.'}}
      ]
  }
};

interface MediaAsset {
    id: string;
    name: string;
    url?: string;
}

export const ContentManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'pages' | 'media'>('pages');
    const [editingPageId, setEditingPageId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Media Library State
    const [assets, setAssets] = useState<MediaAsset[]>(Array.from({ length: 12 }, (_, i) => ({
        id: `asset_${i}`,
        name: `stock_photo_${i + 1}.jpg`
    })));
    const [isUploading, setIsUploading] = useState(false);
    const [uploadFeedback, setUploadFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // In a real app, this would be state initialized from an API
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [content, setContent] = useState(MOCK_CONTENT);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API save
        setTimeout(() => {
            setIsSaving(false);
            setEditingPageId(null);
        }, 800);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset feedback
        setUploadFeedback(null);

        // Validation
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            setUploadFeedback({ type: 'error', message: 'Invalid file type. Please upload JPG, PNG, WEBP, or GIF.' });
            // Reset input
            if(fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
             setUploadFeedback({ type: 'error', message: 'File is too large. Maximum size is 5MB.' });
             if(fileInputRef.current) fileInputRef.current.value = '';
             return;
        }

        setIsUploading(true);

        // Simulate upload latency
        setTimeout(() => {
            const newAsset: MediaAsset = {
                id: `new_${Date.now()}`,
                name: file.name,
                url: URL.createObjectURL(file) // Create local preview
            };
            
            setAssets(prev => [newAsset, ...prev]);
            setIsUploading(false);
            setUploadFeedback({ type: 'success', message: 'Asset uploaded successfully to media library.' });

            // Clear input
            if(fileInputRef.current) fileInputRef.current.value = '';

            // Auto clear success message
            setTimeout(() => setUploadFeedback(null), 4000);
        }, 1500);
    };

    const renderEditor = () => {
        if (!editingPageId) return null;
        const pageData = content[editingPageId as keyof typeof content];
        if (!pageData) return <div>Page not found</div>;

        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => setEditingPageId(null)}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                        <h2 className="text-xl font-bold">Editing: {pageData.title}</h2>
                    </div>
                    <Button onClick={handleSave} isLoading={isSaving}>
                        <Save className="w-4 h-4 mr-2" /> Save Changes
                    </Button>
                </div>

                <div className="space-y-8">
                    {pageData.sections.map((section: any) => (
                        <div key={section.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">{section.label}</h3>
                            <div className="space-y-4">
                                {Object.entries(section.fields).map(([key, value]) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium mb-1 capitalize text-slate-500">{key}</label>
                                        {key === 'text' || key === 'description' || key === 'subtext' || key === 'subtitle' ? (
                                            <textarea 
                                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-cyan outline-none min-h-[100px]"
                                                defaultValue={value as string} 
                                            />
                                        ) : (
                                            <input 
                                                type="text" 
                                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-cyan outline-none"
                                                defaultValue={value as string}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 rounded-lg p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Tip: Use Markdown for rich text formatting in body fields. Changes are auto-saved to drafts but require publishing to go live.
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {!editingPageId && (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Content Manager</h1>
                        <p className="text-slate-500 dark:text-slate-400">Edit website copy and manage media assets.</p>
                    </div>
                    <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button 
                            onClick={() => setActiveTab('pages')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'pages' ? 'bg-white dark:bg-slate-700 shadow text-brand-cyan' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            Pages
                        </button>
                        <button 
                            onClick={() => setActiveTab('media')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'media' ? 'bg-white dark:bg-slate-700 shadow text-brand-cyan' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            Media Library
                        </button>
                    </div>
                </div>
            )}

            {editingPageId ? (
                renderEditor()
            ) : activeTab === 'pages' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {Object.entries(MOCK_CONTENT).map(([id, page]) => (
                        <div key={id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:border-brand-cyan/50 transition-all hover:shadow-lg group flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold">{page.title}</h3>
                                <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-1 rounded-full font-medium">Published</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">
                                <FileText className="w-4 h-4" />
                                <span>{page.sections.length} Editable Sections</span>
                            </div>
                            <div className="flex gap-2 mt-auto">
                                <Button size="sm" variant="outline" className="w-full group-hover:bg-brand-cyan group-hover:text-white group-hover:border-brand-cyan transition-colors" onClick={() => setEditingPageId(id)}>
                                    <Edit2 className="w-4 h-4 mr-2" /> Edit Copy
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-6 animate-fade-in">
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900" />
                                <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white dark:border-slate-900" />
                                <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs text-white font-bold">+2</div>
                            </div>
                            <p className="text-sm text-slate-500">3 users have access to media</p>
                        </div>
                        <div className="relative">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/png, image/jpeg, image/webp, image/gif"
                                onChange={handleFileChange}
                            />
                            <Button onClick={handleUploadClick} isLoading={isUploading}>
                                <Upload className="w-4 h-4 mr-2" /> Upload New Asset
                            </Button>
                        </div>
                     </div>
                     
                     {/* Feedback Banner */}
                     {uploadFeedback && (
                         <div className={`p-4 rounded-lg flex items-center justify-between animate-fade-in ${
                             uploadFeedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300' : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
                         }`}>
                             <div className="flex items-center gap-3">
                                 {uploadFeedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                 <span className="font-medium">{uploadFeedback.message}</span>
                             </div>
                             <button onClick={() => setUploadFeedback(null)} className="hover:opacity-70">
                                 <X className="w-4 h-4" />
                             </button>
                         </div>
                     )}

                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {assets.map((asset) => (
                            <div key={asset.id} className="group relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer">
                                {asset.url ? (
                                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover animate-fade-in" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-700">
                                        <ImageIcon className="w-8 h-8" />
                                    </div>
                                )}
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                    <p className="text-white text-xs font-medium truncate w-full text-center">{asset.name}</p>
                                    <Button size="sm" variant="secondary" className="h-8 text-xs px-2">View</Button>
                                </div>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-white text-slate-900 p-1 rounded-full shadow-sm">
                                        <Check className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            )}
        </div>
    );
};