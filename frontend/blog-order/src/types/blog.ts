export interface BlogVersion {
    versionId: string;
    versionNum: number;
    content: string;
    qcResult: {
        summary: string;
        status: string;
        recommendations: string[];
        issues: string[];
        flags: {
            ai_detectable: boolean;
            has_sensitive_content: boolean;
            missing_backlink: boolean;
            spam_signals: boolean;
        };
    };
}

export interface QcResult {
    summary: string;
    status: string;
    recommendations: string[];
    issues: string[];
    flags: {
        ai_detectable: boolean;
        has_sensitive_content: boolean;
        missing_backlink: boolean;
        spam_signals: boolean;
    };
}

export interface BlogApiResponse {
    articleId: string;
    //   versions: BlogVersion[];
    draft: BlogVersion;
    status: string;
    metadata?: {
        title: string;
        description: string;
        slug: string;
        tags: string[];
        author: string;
        pubDate: Date;
        image: {
            url: string;
            alt: string;
        };
        wordCount: number;
        internalLinksCount: number;
    };
    fileResult?: {
        success: boolean;
        filePath?: string;
        fileName?: string;
        slug?: string;
        error?: string;
    };
}

export interface GenerateBlogRequest {
    domain_id: string;
    user: string;
    niche: string;
    keyword: string;
    topic: string;
    n: number;
    targetURL: string;
    anchorText: string;
    model: string;
    provider: string;
    userPrompt?: string;
    internalLinks?: boolean;
}

export interface GenerateVersionRequest {
    articleId: string;
    provider: string;
}
