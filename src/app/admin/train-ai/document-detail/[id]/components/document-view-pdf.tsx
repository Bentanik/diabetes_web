'use client';

import { memo, forwardRef, useRef, useImperativeHandle } from 'react';
import {
    AreaHighlight,
    Highlight,
    IHighlight,
    PdfHighlighter,
    PdfLoader,
    Popup,
} from 'react-pdf-highlighter';

const HighlightPopup = ({
    comment,
}: {
    comment: { text: string; emoji: string };
}) =>
    comment && comment.text ? (
        <div className="Highlight__popup">
            {comment.emoji} {comment.text}
        </div>
    ) : null;

interface DocumentViewPdfProps {
    highlights: IHighlight[];
    url: string;
}

const DocumentViewPdf = forwardRef(({ highlights, url }: DocumentViewPdfProps, ref) => {
    const scrollRef = useRef<(highlight: IHighlight) => void>(() => { });

    useImperativeHandle(ref, () => ({
        scrollToHighlight: (id: string) => {
            const highlight = highlights.find(h => h.id === id);
            if (highlight && scrollRef.current) {
                scrollRef.current(highlight);
            }
        }
    }));

    return (
        <div className="w-full relative h-[calc(100vh_-_170px)] rounded-[10px] overflow-hidden">
            <PdfLoader
                url={url}
                beforeLoad={<div>Loading PDF...</div>}
                workerSrc="/pdfjs-dist/pdf.worker.min.js"
                errorMessage={<div>Error loading PDF</div>}
            >
                {(pdfDocument) => (
                    <PdfHighlighter
                        pdfDocument={pdfDocument}
                        enableAreaSelection={(event) => event.altKey}
                        onScrollChange={() => { }}
                        scrollRef={(scrollTo) => {
                            scrollRef.current = scrollTo;
                        }}
                        onSelectionFinished={() => null}
                        highlightTransform={(
                            highlight,
                            index,
                            setTip,
                            hideTip,
                            viewportToScaled,
                            screenshot,
                            isScrolledTo,
                        ) => {
                            const isTextHighlight = !Boolean(
                                highlight.content && highlight.content.image,
                            );

                            const component = isTextHighlight ? (
                                <Highlight
                                    isScrolledTo={isScrolledTo}
                                    position={highlight.position}
                                    comment={highlight.comment}
                                />
                            ) : (
                                <AreaHighlight
                                    isScrolledTo={isScrolledTo}
                                    highlight={highlight}
                                    onChange={() => { }}
                                />
                            );

                            return (
                                <Popup
                                    popupContent={<HighlightPopup comment={highlight.comment} />}
                                    onMouseOver={(popupContent) =>
                                        setTip(highlight, () => popupContent)
                                    }
                                    onMouseOut={hideTip}
                                    key={index}
                                >
                                    {component}
                                </Popup>
                            );
                        }}
                        highlights={highlights}
                    />
                )}
            </PdfLoader>
        </div>
    );
});

DocumentViewPdf.displayName = 'DocumentViewPdf';

export default memo(DocumentViewPdf);