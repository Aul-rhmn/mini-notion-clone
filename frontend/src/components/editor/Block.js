import React, { useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { UploadCloud, Link2 } from 'lucide-react';
import api from '../../utils/api';
import Spinner from '../ui/Spinner';

const ImageBlock = ({ block, onContentChange }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const fileInputRef = useRef(null);

    const handleUpload = async (file) => {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }
        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        try {
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onContentChange(block._id, { ...block.content, url: data.url });
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred.';
            console.error('Image upload failed', error.response || error);
            alert(`Image upload failed: ${errorMessage}`);
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleUrlPaste = (e) => {
        const url = e.target.value;
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
             onContentChange(block._id, { ...block.content, url: url });
        }
    };

    const handleFileSelect = (e) => handleUpload(e.target.files[0]);
    const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) { handleUpload(e.dataTransfer.files[0]); } };
    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); };
    const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); };

    if (block.content.url) { return ( <div className="w-full p-1 relative my-2"><img src={block.content.url} alt="block content" className="max-w-full max-h-96 rounded-lg" /></div> ); }

    return (
        <div className="w-full my-2">
            <div className={`p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer transition-colors ${dragOver ? 'border-blue-500 bg-gray-800/50' : 'border-gray-600 hover:border-gray-500'}`} onClick={() => !showUrlInput && fileInputRef.current.click()} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} >
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                {isUploading ? ( <Spinner /> ) : ( <> <UploadCloud size={32} className="mb-2" /> <p className="text-center"><span className="font-semibold text-blue-400">Click to upload</span> or drag and drop</p> <p className="text-xs text-gray-500">PNG, JPG, GIF</p> </> )}
            </div>
            <div className="text-center text-sm text-gray-500 my-2"> or <button onClick={() => setShowUrlInput(!showUrlInput)} className="ml-2 text-blue-400 hover:underline">{showUrlInput ? 'Cancel' : 'Paste an image URL'}</button> </div>
            {showUrlInput && ( <div className="flex items-center space-x-2"> <Link2 className="text-gray-500" /> <input type="text" onBlur={handleUrlPaste} placeholder="Paste your URL here and press Enter" className="w-full bg-gray-700 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }} /> </div> )}
        </div>
    );
}

const Block = ({ block, onContentChange, onCheckboxChange }) => {
  const handleTextChange = (e, field = 'text') => { onContentChange(block._id, { ...block.content, [field]: e.target.value }); };
  
  switch (block.type) {
    case 'text': return <ContentEditable html={block.content.text || ''} onChange={handleTextChange} className="w-full p-1 focus:outline-none min-h-[28px]" />;
    case 'checklist': return ( <div className="flex items-center w-full"> <input type="checkbox" checked={!!block.content.checked} onChange={() => onCheckboxChange(block._id, !block.content.checked)} className="h-5 w-5 mr-3 bg-gray-600 border-gray-500 rounded focus:ring-blue-500" /> <ContentEditable html={block.content.text || ''} onChange={handleTextChange} className={`w-full p-1 focus:outline-none ${block.content.checked ? 'line-through text-gray-500' : ''}`} /> </div> );
    case 'image': return <ImageBlock block={block} onContentChange={onContentChange} />;
    case 'code': return <ContentEditable html={block.content.text || ''} onChange={handleTextChange} className="w-full bg-black/50 rounded-lg p-3 font-mono text-sm focus:outline-none" />;
    default: return <div className="p-2 my-1 text-red-400">Unsupported block type: {block.type}</div>;
  }
};

export default Block;