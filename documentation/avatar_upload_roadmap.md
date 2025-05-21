# Avatar Upload Implementation Roadmap

## Overview
Replace the current URL-based avatar image input with a file upload system that allows users to upload image files directly when creating characters.

## Current State
- Character creation form has text input for `avatar_image` URL field
- Backend API expects `avatar_image` as string (URL/path) in `CharacterCreate` schema
- Frontend sends avatar_image as URL string to `/api/v1/characters/` endpoint

## Goal
Enable users to upload image files (JPG, PNG, GIF) directly through the character creation form, with automatic file handling and URL generation.

## Implementation Plan

### Phase 1: Backend API Changes
**Priority: High**
**Estimated Time: 1-2 hours**

#### 1.1 Modify Character Creation Endpoint
- **Endpoint**: `POST /api/v1/characters/` (existing endpoint)
- **Request**: `multipart/form-data` with:
  - `label`: string
  - `name`: string  
  - `description`: string (optional)
  - `avatar_image`: File (optional) - replaces URL string
- **Response**: Same as current (character object with generated avatar URL)
- **Backend Processing**:
  - Accept both `application/json` (URL mode) and `multipart/form-data` (file mode)
  - When file provided: save to `/uploads/avatars/`, generate unique filename
  - Set `avatar_image` field to generated file path/URL before saving character
- **Validation**:
  - File type: JPG, PNG, GIF, WebP
  - File size: Max 5MB
  - Image dimensions: Max 1024x1024px
- **Security**: 
  - Sanitize filenames
  - Generate unique filenames (UUID + extension)
  - Validate file headers (not just extension)

### Phase 2: Frontend Implementation
**Priority: High**
**Estimated Time: 3-4 hours**

#### 2.1 Create File Upload Component
- **Location**: `src/components/common/FileUpload.tsx`
- **Features**:
  - Drag & drop support
  - File type validation
  - File size validation
  - Image preview
  - Upload progress indicator
  - Error handling

#### 2.2 Update Character Creation Form
- **File**: `src/components/characters/CreateCharacterModal.tsx`
- **Changes**:
  - Replace URL input with FileUpload component
  - Add image preview functionality
  - Handle upload before character creation
  - Show upload progress/status
  - Fallback error handling

#### 2.3 Update API Service
- **File**: `src/services/api.ts`
- **Changes**:
  - Modify `charactersApi.create()` to handle both JSON and FormData
  - When file provided: use `multipart/form-data` instead of JSON
  - Maintain backward compatibility for URL-based avatars

#### 2.4 Update Types
- **File**: `src/types/index.ts`
- **Changes**:
  - Add `UploadResponse` interface
  - Consider adding file validation types

### Phase 3: UX Improvements
**Priority: Medium**
**Estimated Time: 2-3 hours**

#### 3.1 Enhanced File Upload UX
- Default avatar placeholders
- Image cropping/resizing tool
- Multiple file format support
- Better error messages
- Loading states and animations

#### 3.2 Character Display Updates
- **File**: `src/components/characters/CharacterCard.tsx`
- **Changes**:
  - Ensure proper image loading
  - Add fallback for missing images
  - Optimize image display (lazy loading)

### Phase 4: Testing & Polish
**Priority: Medium**
**Estimated Time: 1-2 hours**

#### 4.1 Frontend Testing
- Test file upload flow end-to-end
- Test error scenarios (large files, wrong types, network errors)
- Test image preview and character creation
- Cross-browser testing
- Mobile responsiveness

#### 4.2 Integration Testing
- Test with backend upload endpoint
- Verify file storage and retrieval
- Test character creation with uploaded avatars

## Technical Specifications

### File Upload Component Props
```typescript
interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUploadComplete: (url: string) => void;
  onError: (error: string) => void;
  accept: string;
  maxSize: number;
  preview?: boolean;
}
```

### API Integration Flow
1. User fills out character form and selects image file
2. On form submit: create FormData with all character fields
3. Add image file to FormData as `avatar_image` field
4. Send single request to `/api/v1/characters/` with `multipart/form-data`
5. Backend processes file upload and character creation atomically
6. Character created with uploaded avatar URL in one step

### Error Handling Strategy
- **File too large**: Clear error message with size limit
- **Invalid file type**: List supported formats
- **Upload failure**: Retry option and fallback to URL input
- **Network issues**: Offline support with retry logic

## Dependencies

### Frontend
- No new dependencies required (using existing axios for uploads)
- Consider adding react-dropzone for enhanced drag-drop (optional)

### Backend
- File upload handling (multer for Express, equivalent for your framework)
- Image processing library (Pillow for Python, Sharp for Node.js)
- File storage setup (local filesystem or cloud storage)

## Rollback Plan
- Keep original URL input as fallback option
- Feature flag to switch between upload and URL input
- Graceful degradation if upload endpoint is unavailable

## Security Considerations
- File type validation (both frontend and backend)
- File size limits
- Filename sanitization
- Directory traversal protection
- Malware scanning for uploaded files (future enhancement)
- Image re-encoding to strip metadata

## Performance Considerations
- Image optimization/compression on upload
- Lazy loading for character avatars
- CDN integration for uploaded files (future enhancement)
- Cleanup of unused uploaded files

## Future Enhancements
- Image editing tools (crop, resize, filters)
- Multiple image upload for character galleries
- Avatar template library
- Integration with external image services
- Automatic background removal
- AI-generated avatar options