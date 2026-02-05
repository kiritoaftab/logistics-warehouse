import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import AttachmentsDropzone from "@/pages/components/forms/AttachmentsDropzone";

/**
 * attachments item shape we keep in UI:
 * {
 *   name, type, size,
 *   url,          // preview url OR uploaded url
 *   file?: File   // keep original for future upload
 * }
 */
const AttachmentsSection = forwardRef(({ initial = [], onChange }, ref) => {
  const [attachments, setAttachments] = useState(() => initial || []);

  // ✅ stable onChange (avoid loops)
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const snapshot = useMemo(
    () => ({
      attachments,
      count: attachments?.length || 0,
    }),
    [attachments],
  );

  useEffect(() => {
    onChangeRef.current?.(snapshot);
  }, [snapshot]);

  const validate = (action = "draft") => {
    const errs = [];
    // attachments optional
    return errs;
  };

  useImperativeHandle(ref, () => ({
    getData: () => ({
      attachments,
    }),
    validate,
    // For later: uploadAll() can be added here
  }));

  return (
    <AttachmentsDropzone
      value={attachments}
      onChange={(next) => {
        // If dropzone returns only meta, keep as-is.
        // If you want to keep File object, you must modify dropzone to include it.
        setAttachments(next);
      }}
    />
  );
});

export default AttachmentsSection;
