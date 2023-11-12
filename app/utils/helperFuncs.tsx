export function hashCode(aString: string): number {
    var hash = 0
    for (var i = 0; i < aString.length; i++) {
        var code = aString.charCodeAt(i)
        hash = ((hash<<5)-hash)+code
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash
}

